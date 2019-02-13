function openBearTalk(userid, url, w, h, target, addOptions){

	var keySize = 128;
	var iterations = iterationCount = 10000;
	var iv = "F27D5C9927726BCEFE7510B1BDD3D137";
	var salt = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
	var passPhrase = "passPhrase passPhrase aes encoding algorithm";
	var plainText = "AES ENCODING ALGORITHM PLAIN TEXT";
	//userid ="endtrax";

	// 암복호화
	var aesUtil = new AesUtil(keySize, iterationCount)
	var encrypt = aesUtil.encrypt(salt, iv, passPhrase, userid);
	aesUtil = new AesUtil(keySize, iterationCount)
	var decrypt = aesUtil.decrypt(salt, iv, passPhrase, encrypt);

	//console.log("문자열 : " + userid);
	//console.log("암호화 : " + encrypt);
	//console.log("복호화 : " + decrypt);

	var encodeingEncrpt = encodeURI(encrypt);

	//console.log("인코딩 : " + encodeingEncrpt);

	url = url+'?ssokey='+encodeingEncrpt;
	//console.log("url : " + url);

	openCenterInstance(url, w, h, target, addOptions);
}

/**
 * @date : 2017.08.08
 * @author : 윤성수
 * @description : ITSM용 바로가기 처리를 위하여 아래함수를 추가함.
 */
function openBearTalkITSM(userid, url, w, h, target, addOptions){

	var keySize = 128;
	var iterations = iterationCount = 10000;
	var iv = "F27D5C9927726BCEFE7510B1BDD3D137";
	var salt = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
	var passPhrase = "passPhrase passPhrase aes encoding algorithm";
	var plainText = "AES ENCODING ALGORITHM PLAIN TEXT";
	//userid ="endtrax";

	// 암복호화
	var aesUtil = new AesUtil(keySize, iterationCount)
	var encrypt = aesUtil.encrypt(salt, iv, passPhrase, userid);
	aesUtil = new AesUtil(keySize, iterationCount)
	var decrypt = aesUtil.decrypt(salt, iv, passPhrase, encrypt);

	//console.log("문자열 : " + userid);
	//console.log("암호화 : " + encrypt);
	//console.log("복호화 : " + decrypt);

	var encodeingEncrpt = encodeURIComponent(encrypt);

	//console.log("인코딩 : " + encodeingEncrpt);

	url = url+'?ssokey='+encodeingEncrpt;
	//console.log("url : " + url);

	openCenterInstance(url, w, h, target, addOptions);
}


/**
 * @date : 2017.12.28
 * @author : toru
 * @description : CPS용 바로가기 처리를 위하여 아래함수를 추가함.
 */
function openCPS(userid, url, w, h, target, addOptions){

	var keySize = 128;
	var iterations = iterationCount = 10000;
	var iv = "F27D5C9927726BCEFE7510B1BDD3D137";
	var salt = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
	var passPhrase = "passPhrase passPhrase aes encoding algorithm";
	var plainText = "AES ENCODING ALGORITHM PLAIN TEXT";
	//userid ="endtrax";

	// 암복호화
	var aesUtil = new AesUtil(keySize, iterationCount)
	var encrypt = aesUtil.encrypt(salt, iv, passPhrase, userid);
	aesUtil = new AesUtil(keySize, iterationCount)
	var decrypt = aesUtil.decrypt(salt, iv, passPhrase, encrypt);

	//console.log("문자열 : " + userid);
	//console.log("암호화 : " + encrypt);
	//console.log("복호화 : " + decrypt);

	var encodeingEncrpt = encodeURIComponent(encrypt);

	//console.log("인코딩 : " + encodeingEncrpt);

	url = url+'?ssokey='+encodeingEncrpt;
	//console.log("url : " + url);

	openCenterInstance(url, w, h, target, addOptions);
}

/**
 * @date : 2018.02.01
 * @author : toru
 * @description : ase 암호화용 바로가기 처리를 위하여 아래함수를 추가함.
 */
function openAesSSO(userid, url, w, h, target, addOptions){

	var keySize = 128;
	var iterations = iterationCount = 10000;
	var iv = "F27D5C9927726BCEFE7510B1BDD3D137";
	var salt = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
	var passPhrase = "passPhrase passPhrase aes encoding algorithm";
	var plainText = "AES ENCODING ALGORITHM PLAIN TEXT";
	//userid ="endtrax";

	// 암복호화
	var aesUtil = new AesUtil(keySize, iterationCount)
	var encrypt = aesUtil.encrypt(salt, iv, passPhrase, userid);
	aesUtil = new AesUtil(keySize, iterationCount)
	var decrypt = aesUtil.decrypt(salt, iv, passPhrase, encrypt);

	//console.log("문자열 : " + userid);
	//console.log("암호화 : " + encrypt);
	//console.log("복호화 : " + decrypt);

	var encodeingEncrpt = encodeURIComponent(encrypt);

	//console.log("인코딩 : " + encodeingEncrpt);

	url = url+'?ssokey='+encodeingEncrpt;
	//console.log("url : " + url);

	openCenterInstance(url, w, h, target, addOptions);
}

