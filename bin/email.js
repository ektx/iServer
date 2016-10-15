/*
	邮件发送功能
	-----------------------------------
	@zwl
	@2016-10-15

	通过管理员保存在数据库中的邮件服务器发送邮件给用户

*/
const email = require('nodemailer');

function sendEmail(servers, sendInfo) {
	let transporter = email.createTransport({
		host: servers.host,
		port: servers.port,
		auth: servers.auth,
		secure: false,
		// 不验证服务器
		tls: { rejectUnauthorized: false},
		debug: false
	});

	/*
	sendInfo 示例:
	var mailOptions = {
		from: 'UED <' +usr+'>', 		// 发件地址
		to: '530675800@qq.com',		// 收件地址,多个可用','分隔
		subject: 'Hello!',				// 主题
		text: 'nodejs email test!',		// plaintext body
		html: '<h1>Nodejs email</h1>'	// 邮件内容
	};
	*/

	transporter.sendMail(sendInfo, (err, info)=>{
		if (err) {
			console.log(err)
		} else {
			console.log(info)
		}
	})
}

module.exports = sendEmail;