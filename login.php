<?php

if (isset($_POST['secretKey']))
{
	$secretKey = $_POST['secretKey'];
	$userCode = '';
	$userName = '';
	$sendData = array();
	$userData = json_decode(file_get_contents('./data/users.json'));
	foreach ($userData as $user) {
		foreach ($user as $key => $value)
		{
			
			if(strcmp($key,'secretKey') == 0 && strcmp($secretKey,$value) == 0) // user is valid 
			 {
			 	// create an object with user information to be sent back
				$userCode = $user->userCode;
				$userName = $user->userName;
				$userInfoToSend = array("userCode"=>$userCode,"userName"=>$userName,"secretKey"=>$secretKey);
				array_push($sendData,$userInfoToSend);

				// store cookie in user's system
				setcookie('secretKey',md5($secretKey),time()+60*60*24*365,'/');
				setcookie('userCode',$userCode,time()+60*60*24*365,'/');
				setcookie('userName',$userName,time()+60*60*24*365,'/');
			}
		}
	}
	// add info for all users anyway
	array_push($sendData,$userData);
}
	echo json_encode($sendData);
?>