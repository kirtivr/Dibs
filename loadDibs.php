<?php

    $baseDir = './img/';
    $userDir = $_POST['userCode'];
    $dir = $baseDir.$userDir.'/';

    $files = scandir($dir);
    $images = array();

    foreach($files as $file)
    {
    	if(!is_dir($file))
    	{
    		$dibName = basename($file,pathinfo($file,PATHINFO_EXTENSION));
    		$dibData = array('dibName' => $dibName ,'imageName' => $file);
    		array_push($images,$dibData);
    	}
    }

    echo json_encode($images);
?>