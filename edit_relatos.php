<?php 
include "conexao.php";
$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

	$fk_boat = $_POST['fk_boat'];
	$smtm = "SELECT boat, fk_tipo_boat FROM boats WHERE boat=:boat AND (fk_tipo_boat='PENDENTE' OR fk_tipo_boat = 'CORREÇÃO') LIMIT 1";
	$result = $conn->prepare($smtm);
	$result->bindParam(':boat', $fk_boat, PDO::PARAM_STR);
    $result->execute();

	if ($result->rowCount()) {
		$assets ='../anexo_relatos/'. date('Y') . '/'.date('m').'/'.$fk_boat.'/';
		$vazio = "";
		if (!is_dir($assets)) {
			mkdir('../anexo_relatos/' . date('Y') . '/'.date('m').'/'.$fk_boat.'/', 0777, true);
		}

		$query_pes = "SELECT fk_boat FROM anexos_relatos WHERE fk_boat=:fk_boat LIMIT 1";
		$pes_anexo = $conn->prepare($query_pes);
		$pes_anexo->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
		$pes_anexo->execute();

		if (($pes_anexo) && ($pes_anexo->rowCount() == 0)) {
			$query = "INSERT INTO anexos_relatos (fk_boat, user_cad, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, created) VALUES (:fk_boat, :user_cad, :img1, :img2, :img3, :img4, :img5, :img6, :img7, :img8, :img9, :img10, :img11, :img12, :img13, :img14, :img15, :img16, DATE_SUB(now(), INTERVAL 3 HOUR))";
			$inserir = $conn->prepare($query);
			$inserir->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
			$inserir->bindParam(':user_cad', $_POST['usuario'], PDO::PARAM_STR);

			if ($_POST['img1'] != '') {
				$img1 = "img1.jpg";
				$output_1 = $assets.$img1;
	
				$img1 = base64_decode($_POST['img1']);
				$fp_img1 = fopen($output_1, 'w+');
				fwrite($fp_img1, $img1);
				$inserir->bindParam(':img1', $output_1, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img1'] != '') {
				$inserir->bindParam(':img1', $_POST['edit_img1'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img1', $vazio, PDO::PARAM_STR);
			}
	
			if ($_POST['img2'] != '') {
				$img2 = "img2.jpg";
				$output_2 = $assets.$img2;
	
				$img2 = base64_decode($_POST['img2']);
				$fp_img2 = fopen($output_2, 'w+');
				fwrite($fp_img2, $img2);
				$inserir->bindParam(':img2', $output_2, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img2'] != '') {
				$inserir->bindParam(':img2', $_POST['edit_img2'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img2', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img3'] != '') {
				$img3 = "img3.jpg";
				$output_3 = $assets.$img3;
	
				$img3 = base64_decode($_POST['img3']);
				$fp_img3 = fopen($output_3, 'w+');
				fwrite($fp_img3, $img3);
				$inserir->bindParam(':img3', $output_3, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img3'] != '') {
				$inserir->bindParam(':img3', $_POST['edit_img3'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img3', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img4'] != '') {
				$img4 = "img4.jpg";
				$output_4 = $assets.$img4;
	
				$img4 = base64_decode($_POST['img4']);
				$fp_img4 = fopen($output_4, 'w+');
				fwrite($fp_img4, $img4);
				$inserir->bindParam(':img4', $output_4, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img4'] != '') {
				$inserir->bindParam(':img4', $_POST['edit_img4'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img4', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img5'] != '') {
				$img5 = "img5.jpg";
				$output_5 = $assets.$img5;
	
				$img5 = base64_decode($_POST['img5']);
				$fp_img5 = fopen($output_5, 'w+');
				fwrite($fp_img5, $img5);
				$inserir->bindParam(':img5', $output_5, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img5'] != '') {
				$inserir->bindParam(':img5', $_POST['edit_img5'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img5', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img6'] != '') {
				$img6 = "img6.jpg";
				$output_6 = $assets.$img6;
	
				$img6 = base64_decode($_POST['img6']);
				$fp_img6 = fopen($output_6, 'w+');
				fwrite($fp_img6, $img6);
				$inserir->bindParam(':img6', $output_6, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img6'] != '') {
				$inserir->bindParam(':img6', $_POST['edit_img6'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img6', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img7'] != '') {
				$img7 = "img7.jpg";
				$output_7 = $assets.$img7;
	
				$img7 = base64_decode($_POST['img7']);
				$fp_img7 = fopen($output_7, 'w+');
				fwrite($fp_img7, $img7);
				$inserir->bindParam(':img7', $output_7, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img7'] != '') {
				$inserir->bindParam(':img7', $_POST['edit_img7'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img7', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img8'] != '') {
				$img8 = "img8.jpg";
				$output_8 = $assets.$img8;
	
				$img8 = base64_decode($_POST['img8']);
				$fp_img8 = fopen($output_8, 'w+');
				fwrite($fp_img8, $img8);
				$inserir->bindParam(':img8', $output_8, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img8'] != '') {
				$inserir->bindParam(':img8', $_POST['edit_img8'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img8', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img9'] != '') {
				$img9 = "img9.jpg";
				$output_9 = $assets.$img9;
	
				$img9 = base64_decode($_POST['img9']);
				$fp_img9 = fopen($output_9, 'w+');
				fwrite($fp_img9, $img9);
				$inserir->bindParam(':img9', $output_9, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img9'] != '') {
				$inserir->bindParam(':img9', $_POST['edit_img9'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img9', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img10'] != '') {
				$img10 = "img10.jpg";
				$output_10 = $assets.$img10;
	
				$img10 = base64_decode($_POST['img10']);
				$fp_img10 = fopen($output_10, 'w+');
				fwrite($fp_img10, $img10);
				$inserir->bindParam(':img10', $output_10, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img10'] != '') {
				$inserir->bindParam(':img10', $_POST['edit_img10'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img10', $vazio, PDO::PARAM_STR);
			}

			if ($_POST['img11'] != '') {
				$img11 = "img11.jpg";
				$output_11 = $assets.$img11;
	
				$img11 = base64_decode($_POST['img11']);
				$fp_img11 = fopen($output_11, 'w+');
				fwrite($fp_img11, $img11);
				$inserir->bindParam(':img11', $output_11, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img11'] != '') {
				$inserir->bindParam(':img11', $_POST['edit_img11'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img11', $vazio, PDO::PARAM_STR);
			} 

			if ($_POST['img12'] != '') {
				$img12 = "img12.jpg";
				$output_12 = $assets.$img12;
	
				$img12 = base64_decode($_POST['img12']);
				$fp_img12 = fopen($output_12, 'w+');
				fwrite($fp_img12, $img12);
				$inserir->bindParam(':img12', $output_12, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img12'] != '') {
				$inserir->bindParam(':img12', $_POST['edit_img12'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img12', $vazio, PDO::PARAM_STR);
			}
			
			if ($_POST['img13'] != '') {
				$img13 = "img13.jpg";
				$output_13 = $assets.$img13;
	
				$img13 = base64_decode($_POST['img13']);
				$fp_img13 = fopen($output_13, 'w+');
				fwrite($fp_img13, $img13);
				$inserir->bindParam(':img13', $output_13, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img13'] != '') {
				$inserir->bindParam(':img13', $_POST['edit_img13'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img13', $vazio, PDO::PARAM_STR);
			}

			if ($_POST['img14'] != '') {
				$img14 = "img14.jpg";
				$output_14 = $assets.$img14;
	
				$img14 = base64_decode($_POST['img14']);
				$fp_img14 = fopen($output_14, 'w+');
				fwrite($fp_img14, $img14);
				$inserir->bindParam(':img14', $output_14, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img14'] != '') {
				$inserir->bindParam(':img14', $_POST['edit_img14'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img14', $vazio, PDO::PARAM_STR);
			} 
			if ($_POST['img15'] != '') {
				$img15 = "img15.jpg";
				$output_15 = $assets.$img15;
	
				$img15 = base64_decode($_POST['img15']);
				$fp_img15 = fopen($output_15, 'w+');
				fwrite($fp_img15, $img15);
				$inserir->bindParam(':img15', $output_15, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img15'] != '') {
				$inserir->bindParam(':img15', $_POST['edit_img15'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img15', $vazio, PDO::PARAM_STR);
			}
			
			if ($_POST['img16'] != '') {
				$img16 = "img16.jpg";
				$output_16 = $assets.$img16;
	
				$img16 = base64_decode($_POST['img16']);
				$fp_img16 = fopen($output_16, 'w+');
				fwrite($fp_img16, $img16);
				$inserir->bindParam(':img16', $output_16, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img16'] != '') {
				$inserir->bindParam(':img16', $_POST['edit_img16'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img16', $vazio, PDO::PARAM_STR);
			} 

			$inserir->execute();
			if ($inserir->rowCount()) {
				echo "RELATOS SALVOS COM SUCESSO!";
			} else {
				echo "RELATOS NÃO SALVAS!";
			}


		}else {
			$vazio = "";
			$query = "UPDATE anexos_relatos SET user_cad=:user_cad, img1=:img1, img2=:img2, img3=:img3, img4=:img4, img5=:img5, img6=:img6, img7=:img7, img8=:img8, img9=:img9, img10=:img10, img11=:img11, img12=:img12, img13=:img13, img14=:img14, img15=:img15, img16=:img16, modified=now() WHERE fk_boat=:fk_boat";
			$inserir = $conn->prepare($query);
			$inserir->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
			$inserir->bindParam(':user_cad', $_POST['usuario'], PDO::PARAM_STR);
			
			if ($_POST['img1'] != '') {
				$img1 = "img1.jpg";
				$output_1 = $assets.$img1;
	
				$img1 = base64_decode($_POST['img1']);
				$fp_img1 = fopen($output_1, 'w+');
				fwrite($fp_img1, $img1);
				$inserir->bindParam(':img1', $output_1, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img1'] != '') {
				$inserir->bindParam(':img1', $_POST['edit_img1'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img1', $vazio, PDO::PARAM_STR);
			}
	
			if ($_POST['img2'] != '') {
				$img2 = "img2.jpg";
				$output_2 = $assets.$img2;
	
				$img2 = base64_decode($_POST['img2']);
				$fp_img2 = fopen($output_2, 'w+');
				fwrite($fp_img2, $img2);
				$inserir->bindParam(':img2', $output_2, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img2'] != '') {
				$inserir->bindParam(':img2', $_POST['edit_img2'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img2', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img3'] != '') {
				$img3 = "img3.jpg";
				$output_3 = $assets.$img3;
	
				$img3 = base64_decode($_POST['img3']);
				$fp_img3 = fopen($output_3, 'w+');
				fwrite($fp_img3, $img3);
				$inserir->bindParam(':img3', $output_3, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img3'] != '') {
				$inserir->bindParam(':img3', $_POST['edit_img3'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img3', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img4'] != '') {
				$img4 = "img4.jpg";
				$output_4 = $assets.$img4;
	
				$img4 = base64_decode($_POST['img4']);
				$fp_img4 = fopen($output_4, 'w+');
				fwrite($fp_img4, $img4);
				$inserir->bindParam(':img4', $output_4, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img4'] != '') {
				$inserir->bindParam(':img4', $_POST['edit_img4'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img4', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img5'] != '') {
				$img5 = "img5.jpg";
				$output_5 = $assets.$img5;
	
				$img5 = base64_decode($_POST['img5']);
				$fp_img5 = fopen($output_5, 'w+');
				fwrite($fp_img5, $img5);
				$inserir->bindParam(':img5', $output_5, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img5'] != '') {
				$inserir->bindParam(':img5', $_POST['edit_img5'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img5', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img6'] != '') {
				$img6 = "img6.jpg";
				$output_6 = $assets.$img6;
	
				$img6 = base64_decode($_POST['img6']);
				$fp_img6 = fopen($output_6, 'w+');
				fwrite($fp_img6, $img6);
				$inserir->bindParam(':img6', $output_6, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img6'] != '') {
				$inserir->bindParam(':img6', $_POST['edit_img6'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img6', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img7'] != '') {
				$img7 = "img7.jpg";
				$output_7 = $assets.$img7;
	
				$img7 = base64_decode($_POST['img7']);
				$fp_img7 = fopen($output_7, 'w+');
				fwrite($fp_img7, $img7);
				$inserir->bindParam(':img7', $output_7, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img7'] != '') {
				$inserir->bindParam(':img7', $_POST['edit_img7'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img7', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img8'] != '') {
				$img8 = "img8.jpg";
				$output_8 = $assets.$img8;
	
				$img8 = base64_decode($_POST['img8']);
				$fp_img8 = fopen($output_8, 'w+');
				fwrite($fp_img8, $img8);
				$inserir->bindParam(':img8', $output_8, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img8'] != '') {
				$inserir->bindParam(':img8', $_POST['edit_img8'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img8', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img9'] != '') {
				$img9 = "img9.jpg";
				$output_9 = $assets.$img9;
	
				$img9 = base64_decode($_POST['img9']);
				$fp_img9 = fopen($output_9, 'w+');
				fwrite($fp_img9, $img9);
				$inserir->bindParam(':img9', $output_9, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img9'] != '') {
				$inserir->bindParam(':img9', $_POST['edit_img9'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img9', $vazio, PDO::PARAM_STR);
			} 
	
			if ($_POST['img10'] != '') {
				$img10 = "img10.jpg";
				$output_10 = $assets.$img10;
	
				$img10 = base64_decode($_POST['img10']);
				$fp_img10 = fopen($output_10, 'w+');
				fwrite($fp_img10, $img10);
				$inserir->bindParam(':img10', $output_10, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img10'] != '') {
				$inserir->bindParam(':img10', $_POST['edit_img10'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img10', $vazio, PDO::PARAM_STR);
			} 

			if ($_POST['img11'] != '') {
				$img11 = "img11.jpg";
				$output_11 = $assets.$img11;
	
				$img11 = base64_decode($_POST['img11']);
				$fp_img11 = fopen($output_11, 'w+');
				fwrite($fp_img11, $img11);
				$inserir->bindParam(':img11', $output_11, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img11'] != '') {
				$inserir->bindParam(':img11', $_POST['edit_img11'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img11', $vazio, PDO::PARAM_STR);
			}
			
			if ($_POST['img12'] != '') {
				$img12 = "img12.jpg";
				$output_12 = $assets.$img12;
	
				$img12 = base64_decode($_POST['img12']);
				$fp_img12 = fopen($output_12, 'w+');
				fwrite($fp_img12, $img12);
				$inserir->bindParam(':img12', $output_12, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img12'] != '') {
				$inserir->bindParam(':img12', $_POST['edit_img12'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img12', $vazio, PDO::PARAM_STR);
			} 

			if ($_POST['img13'] != '') {
				$img13 = "img13.jpg";
				$output_13 = $assets.$img13;
	
				$img13 = base64_decode($_POST['img13']);
				$fp_img13 = fopen($output_13, 'w+');
				fwrite($fp_img13, $img13);
				$inserir->bindParam(':img13', $output_13, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img13'] != '') {
				$inserir->bindParam(':img13', $_POST['edit_img13'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img13', $vazio, PDO::PARAM_STR);
			}

			if ($_POST['img14'] != '') {
				$img14 = "img14.jpg";
				$output_14 = $assets.$img14;
	
				$img14 = base64_decode($_POST['img14']);
				$fp_img14 = fopen($output_14, 'w+');
				fwrite($fp_img14, $img14);
				$inserir->bindParam(':img14', $output_14, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img14'] != '') {
				$inserir->bindParam(':img14', $_POST['edit_img14'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img14', $vazio, PDO::PARAM_STR);
			}

			if ($_POST['img15'] != '') {
				$img15 = "img15.jpg";
				$output_15 = $assets.$img15;
	
				$img15 = base64_decode($_POST['img15']);
				$fp_img15 = fopen($output_15, 'w+');
				fwrite($fp_img15, $img15);
				$inserir->bindParam(':img15', $output_15, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img15'] != '') {
				$inserir->bindParam(':img15', $_POST['edit_img15'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img15', $vazio, PDO::PARAM_STR);
			} 

			if ($_POST['img16'] != '') {
				$img16 = "img16.jpg";
				$output_16 = $assets.$img16;
	
				$img16 = base64_decode($_POST['img16']);
				$fp_img16 = fopen($output_16, 'w+');
				fwrite($fp_img16, $img16);
				$inserir->bindParam(':img16', $output_16, PDO::PARAM_STR);
				
			}elseif ($_POST['edit_img16'] != '') {
				$inserir->bindParam(':img16', $_POST['edit_img16'], PDO::PARAM_STR);
	
			}else {
				$inserir->bindParam(':img16', $vazio, PDO::PARAM_STR);
			} 
	
			$inserir->execute();
			if ($inserir->rowCount()) {
				echo "RELATOS ATUALIZADOS COM SUCESSO!";
			} else {
				echo "RELATOS NÃO ATUALIZADOS!";
			}
	
		}

	}else {
		echo "SEM PERMISSÃO PARA INSERIR FOTOS, BOLETIM JÁ FINALIZADO, ENTRE EM CONTATO COM A COORDENAÇÃO";
	}
	
}else {
	echo "SEM PERMISÃO PARA ACESSO!";
}
?>