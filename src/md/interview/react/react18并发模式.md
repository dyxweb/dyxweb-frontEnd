## 并发模式(Concurrent Mode)
- React团队在React 16中提出了并发模式的概念，并在React 18中开放使用，React16、17一直为此做准备。
- 并发模式最大的意义在于React渲染过程可以被暂停、延迟甚至放弃，不会长时间阻塞浏览器渲染；高优先级更新可以中断低优先级更新，优先渲染。
- 并发模式只是提供了可中断的能力，React并不会自动帮开发者区分不同优先级的更新。
- 默认情况下所有的更新都是紧急更新不能被中断，过渡更新是低优先级的更新可以被中断。
- 为了保持向后兼容性，React 18的行为和之前的版本一样，所有更新都是紧急更新，可以通过startTransition或useDeferredValue将更新标记为低优先级更新。
- 在并发模式下React每执行一个任务都会看看有没有更高优先级的更新，如果有则当前低优先级的的更新会被暂停，待高优先级任务执行完之后，再继续执行或重新执行。
### 开启并发模式
- 开启并发模式的前提是使用ReactDOM.createRoot挂载组件。
- 需要手动使用startTransition或useDeferredValue改变React渲染更新的优先级，并不是开启并发模式React自动会控制渲染过程的暂停、延迟等。
### 并发模式特点
- React并发模式并不会并行运行任务，它会将非紧急任务移动到过渡状态，并优先执行紧急任务。使用相同的线程来处理它们。
- React的并发模式，只是让我们的项目拥有了辨别优先级的能力，并且在一定限制条件下能够快速响应用户操作。如果单个任务执行耗时很长，即使设置了startTransition也无能为力。如果存在这种情况需要将单个任务继续拆分或者利用Web Worker进行多线程处理。
- **并发模式只能控制React中js的操作(Render阶段)，针对真实DOM的更新(Commit阶段)导致用户操作不能及时响应时并发模式无法处理。**
- 耗时任务应该分割成组件，以便过渡正常工作，通过startTransition处理后它能够中断树遍历(中断了Render阶段)，以便浏览器可以处理高优先级任务。如果一个单一的任务耗时很长，并发模式变得无效，**并发模式是在多个任务执行耗时过长时中断而不是中断单个耗时较长的任务**。
### React的状态更新可以分为两类
1. 紧急更新(高优先级更新)：比如打字、点击、拖动等，需要立即响应的行为，如果不立即响应会给人很卡，或者应用出问题的感觉。
2. 过渡更新(低优先级更新)：将UI从一个视图过渡到另一个视图，不需要即时响应，有些延迟是可以接受的。
### 中断和切换
- 在处理低优先级更新时，React在处理完每个任务后会暂停，并检查是否有高优先级更新需要处理。如果有React会暂停当前处理，切换到处理高优先级更新，处理完高优先级更新后React会返回处理低优先级更新(如果它无效了就丢弃它)。除了高优先级更新React还会检查当前渲染是否耗时过长，如果耗时过长React会将控制权还给浏览器，以便它可以重绘屏幕，避免卡顿和冻结。
- 由于React只能在组件之间暂停(它不能在组件中间停下来)，所以如果有一两个特别重的组件，并发渲染帮助不大。如果组件渲染需要300毫秒，浏览器就会被阻塞300毫秒。并发渲染真正发挥作用的地方是当你的组件只是稍微慢一点，但它们的数量比较多，以至于总渲染时间相当长。
- 将高优先级更新和低优先级更新分开独立考虑，高优先级更新和低优先级更新不是在一个Diff链路中，如果在一个Diff链路中时，无论Diff的先后最后更新视图(Commit)是一起的。不在同一个Diff链路时，最后更新视图(Commit)是独立的，会区分出更新的先后顺序。
### startTransition
> 使用startTransition只是告知React，有一些操作是不紧急的，如果遇到优先级更高的任务，不紧急的任务可以不立马执行，而是在处理完高优先级任务后才进行低优先级任务的执行。

- 当用户在搜索输入框中输入时更新状态变量inputValue，然后调用startTransition，传入一个包含另一个状态更新的函数。
- 传入的函数会立即被调用，React会记录其执行期间所做的任何状态更改，并将它们标记为低优先级更新。
- 实际上启动了两个更新：一个是紧急的(更新inputValue)，另一个是transition(更新searchQuery)。
```
import { startTransition, useState } from 'react'

const StartTransitionUsage = () => {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const onInputChange = (value: string) => {
    setInputValue(value)
    startTransition(() => {
      setSearchQuery(value)
    })
  }

  return (
    <div>
      <SectionHeader title="Movies" />
      <input placeholder="Search" value={inputValue} onChange={(e) => onInputChange(e.target.value)} />
      <MoviesCatalog searchQuery={searchQuery} />
    </div>
  )
}
```
### useTransition
- 调用useTransition会返回一个boolean值(表示是否有低优先级更新正在进行)和一个用来启动transition的startTransition函数。
- 以这种方式启动transition时，React实际上会进行两次渲染：
    1. 一次高优先级更新将isPending变为true。
    2. 一次低优先级更新startTransition函数中实际状态的更改。
```
import { useTransition, useState } from 'react'

const UseTransitionUsage = () => {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const onInputChange = (value: string) => {
    setInputValue(value)
    startTransition(() => {
      setSearchQuery(value)
    })
  }

  return (
    <div>
      <SectionHeader title="Movies" isLoading={isPending} />
      <input placeholder="Search" value={inputValue} onChange={(e) => onInputChange(e.target.value)} />
      <MoviesCatalog searchQuery={searchQuery} />
    </div>
  )
}
```