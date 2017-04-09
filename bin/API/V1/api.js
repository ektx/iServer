/*
	iServer API
	-------------------------------------------
	用于扩展的api接口,对外只输出指定的 json 格式数据
	
	@author: zwl(ektx1989@gmail.com)
	@date: 2017-4-9 日
*/
const Schemas = require('./../../schemas');


exports.API_usrHome = (req, res)=> {
	
	// 访问用户名
	let askUsr = req.params.usr;

	// 是否有用户
	let hasAskUsr = new Promise( (resolve, reject) => {
		Schemas.usrs_m.findOne(
			{'account': askUsr },
			{_id: 0, pwd: 0},
			(err, data) => {
				if (data) {
					resolve({
						success: true,
						data: {
							usr: data.account,
							pic: data.ico
						}
					})
				} else {
					reject({
						success: false,
						data: {
							msg: 'Not find user!'
						}
					})
				}
			}
		)
	});

	/*
		@usrData [Array] 用户信息
		@proData [Array] 项目信息
	*/
	let sendMsg = (req, res, usrData, proData)=> {
		console.log( usrData, proData)

		if (!proData.length) {
			proData = false;
		}

		res.send({
			success: true,		// 状态
			askUser: usrData,	// 访问用户信息
			project: proData	// 访问的用户项目
		});
	};

	hasAskUsr.then(
		(data) => {
			// 如果是非登录用户
			if (askUsr !== req.session.act) {
				Schemas.project_m.find(
					{
						usr: askUsr,
						private: false
					},
					(err, proData) => {
						sendMsg(req, res, data.data, proData.reverse() )
					}
				)
			} 
			// 如果是登录用户
			else {
				Schemas.project_m.find(
					{usr: askUsr},
					(err, proData) => {
						sendMsg(req, res, data.data, proData.resolve())
					}
				)
			}
		}
	),
	(reject) => {
		res.send(reject)
	}
}
