## Web Worker与Shared Worker
> 本质上就是进程和线程的区别。Shared Worker由独立的进程管理，Web Worker只是属于某个渲染进程(浏览器内核)下的一个线程。

- Web Worker只属于某个页面，不会和其它页面的渲染进程(浏览器内核)共享，所以Chrome会在渲染进程(每一个Tab页就是一个渲染进程)中创建一个新的线程来运行Worker中的JavaScript程序。
- Shared Worker是浏览器所有页面共享的，不能采用与Worker同样的方式实现，因为它不隶属于某个渲染进程(浏览器内核)，可以为多个渲染进程共享使用，所以Chrome浏览器为Shared Worker单独创建一个进程来运行JavaScript程序，在浏览器中每个相同的JavaScript只存在一个SharedWorker进程，不管它被创建多少次。