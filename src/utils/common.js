export const isPC = () => {    
	var userAgentInfo = navigator.userAgent;    
	var Agents = ["Android", "iPhone", "ymbianOS", "Windows Phone", "iPad", "iPod"];   
	var flag = true;   
	for (var v = 0; v < Agents.length; v++) {       
		if (userAgentInfo.indexOf(Agents[v]) > 0) {            
			flag = false;            
			break;       
		 }  
	 }   
	return flag;
}
