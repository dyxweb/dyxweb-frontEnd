## https
> HTTP是明文传输，因此在传输过程中数据都有可能被第三方窃取或者篡改，也就是我们常说的中间人攻击。为了防范攻击，引入新的加密方案，即 HTTPS。

### 安全层
> HTTPS并不是一个新的协议, 它在HTTP和TCP的传输中建立了一个安全层，利用对称加密和非对称加密结合数字证书认证的方式，让传输过程的安全性大大提高。

### 对称加密
> 指的是加密和解密用的是同样的密钥。第三方在传输过程中可以在中间获取到client_random、server_random和加密方法，由于这个加密方法同时可以解密，所以中间人可以成功对暗号进行解密，拿到数据，很容易就将这种加密方式破解了。

### 非对称加密
> 如果有 A、 B 两把密钥，如果用 A 加密过的数据包只能用 B 解密，反之，如果用 B 加密过的数据包只能用 A 解密。浏览器发送请求，服务器把公钥传给浏览器。然后浏览器用公钥加密进行传输，服务器使用私钥解密，但服务器的数据只能用私钥进行加密(因为如果它用公钥那么浏览器也没法解密啦，因为浏览器没有私钥，只有服务器给的公钥)，中间人一旦拿到公钥，那么就可以对服务端传来的数据进行解密了，就这样又被破解了。而且，只是采用非对称加密，对于服务器性能的消耗也是相当巨大的。

### 结合使用
> 浏览器发送请求，服务器把公钥传给浏览器。然后浏览器用公钥加密一个随机数进行传输，服务器使用私钥解密传输的随机数，然后使用对称的密钥加密随机数生成最终的密钥，这样的密钥是无法获取到的，因为中间人没有私钥，从而拿不到随机数，也就无法生成最终的密钥了。单独使用非对称加密，最大的漏洞在于服务器传数据给浏览器只能用私钥加密，这是危险产生的根源。利用对称和非对称加密结合的方式，就防止了这一点，从而保证了安全。

### 数字证书
> 通过两者加密方式的结合，能够很好地实现加密传输，但实际上还是存在一些问题。黑客如果采用 DNS 劫持，将目标地址替换成黑客服务器的地址，然后黑客自己造一份公钥和私钥，照样能进行数据传输。添加了数字证书认证的步骤就是让服务器证明自己的身份。向第三方机构也叫CA(Certificate Authority), 认证通过后 CA 会给服务器颁发数字证书。上述步骤中服务器返回公钥的时候会把数字证书返回，浏览器进行验证。

#### 作用
- 服务器向浏览器证明自己的身份。
- 把公钥传给浏览器。

#### 浏览器验证数字证书
1. 读取证书中的明文内容。CA 进行数字证书的签名时会保存一个 Hash 函数，来这个函数来计算明文内容得到信息A
2. 然后用公钥解密明文内容得到信息B
3. 两份信息做比对，一致则表示认证合法

### http和https的区别
1. HTTP 明文传输，数据都是未加密的，安全性较差，HTTPS（SSL+HTTP） 数据传输过程是加密的，安全性较好。
2. 使用 HTTPS 协议需要到 CA（Certificate Authority，数字证书认证机构） 申请证书，一般免费证书较少，因而需要一定费用。
3. HTTP 页面响应速度比 HTTPS 快，主要是因为 HTTP 使用 TCP 三次握手建立连接，客户端和服务器需要交换 3 个包，而 HTTPS除了 TCP 的三个包，还要加上 ssl 握手需要的 9 个包，所以一共是 12 个包。
4. http 和 https 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。
5. HTTPS 其实就是建构在 SSL/TLS 之上的 HTTP 协议，所以，要比较 HTTPS 比 HTTP 要更耗费服务器资源。