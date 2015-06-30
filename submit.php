<?php
$data = array();

if(isset($_GET['files']))
{  
    $error = false;
    $files = array();

    $uploaddir = './img/';
    $uploadUserDir = $_POST['userCode'];
    $uploaddir = $uploaddir.$uploadUserDir.'/';

    foreach($_FILES as $file)
    {   
        $fileName = $_POST['dibName'];
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileFullName = $fileName.'.'.$fileExtension ;
        $uploadPath = $uploaddir.$fileFullName;

        $allowedExts = array("gif", "jpeg", "jpg", "png");
        $errorType = '';

        $extension = end(explode(".", $file['name']));
        if ((($file['type'] == "image/gif")
        || ($file['type'] == "image/jpeg")
        || ($file['type'] == "image/jpg")
        || ($file['type'] == "image/png"))
        && in_array($extension, $allowedExts))
        {
            $error = true;
            $errorType = 'fileType';
        }

        if ($file['size'] > 3145728)
        if(!$error && move_uploaded_file($file['tmp_name'],$uploadPath ))
        {
            $files[] = $uploaddir .$fileFullName;
        }
        else
        {
            $error = true;
        }
        }
    $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
}
else
{
    $data = array('success' => 'Form was submitted', 'formData' => $_POST);
}
    print_r($uploaddir.$fileFullName).PHP_EOL;
    echo('$_GET').PHP_EOL;
    print_r($_GET);
    echo('$_FILES').PHP_EOL;
    print_r($_FILES);
    echo('$_POST').PHP_EOL;
    print_r($_POST);
?>