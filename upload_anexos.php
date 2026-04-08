<?php 
include "conexao.php";
$SQLKEY = "w.mendessmtt63761";

if ((isset($_POST['key']) &&  $_POST['key'] == $SQLKEY) || (isset($_GET['key']) && $_GET['key'] == $SQLKEY)) {
	
	if (isset($_GET['fk_boat_photo'])) {
		$query = "SELECT id_anexo, fk_boat, path FROM anexos WHERE fk_boat=:fk_boat";
		$result = $conn->prepare($query);
		$result->bindParam(':fk_boat', $_GET['fk_boat_photo'], PDO::PARAM_STR);
		$resultado = [];
		$result->execute();
		if ($result->rowCount()) {
			while($row = $result->fetch(PDO::FETCH_ASSOC)){
				$idCheck = $row['id_anexo']; // Identificador único da tabela check
		
				// Verifica se o id_check já existe no array resultado
				if (!isset($resultado[$idCheck])) {
					// Cria a estrutura inicial para este id_check
					$resultado[$idCheck] = [
						'photos' => [
							'id_anexo' => $row['id_anexo'],
							'path' => $row['path']
						]   // Array vazio para as fotos
					];
				}
			};
			// Remove as chaves numéricas do array principal, mantendo apenas os valores
			$resultado = array_values($resultado);
		
			// Exibe o resultado final
			echo json_encode($resultado);
		}else{
			echo "NENHUMA FOTO ENCONTRADA";
		}
	}elseif (isset($_GET['fk_boat_relato'])) {
		$query = "SELECT id_relato, fk_boat, path FROM anexos_relatos WHERE fk_boat=:fk_boat";
		$result = $conn->prepare($query);
		$result->bindParam(':fk_boat', $_GET['fk_boat_relato'], PDO::PARAM_STR);
		$resultado = [];
		$result->execute();
		if ($result->rowCount()) {
			while($row = $result->fetch(PDO::FETCH_ASSOC)){
				$idCheck = $row['id_relato']; // Identificador único da tabela check
		
				// Verifica se o id_check já existe no array resultado
				if (!isset($resultado[$idCheck])) {
					// Cria a estrutura inicial para este id_check
					$resultado[$idCheck] = [
						'photos' => [
							'id_relato' => $row['id_relato'],
							'path' => $row['path']
						]   // Array vazio para as fotos
					];
				}
			};
			// Remove as chaves numéricas do array principal, mantendo apenas os valores
			$resultado = array_values($resultado);
		
			// Exibe o resultado final
			echo json_encode($resultado);
		}else{
			echo "NENHUM RELATO ENCONTRADO";
		}
	}else {
		$fk_boat = $_POST['fk_boat'];
		//Photos
		if (isset($_POST['insert_photo'])) {
				
			if (!is_dir($assets)) {
				mkdir('../anexo/' . date('Y') . '/'.date('m').'/'.$fk_boat.'/', 0777, true);
			}
			$assets ='../anexo/'. date('Y') . '/'.date('m').'/'.$fk_boat.'/';
			
			if (isset($_POST['insert'])) {

				$smtm = "SELECT boat FROM boats WHERE boat=:boat AND (fk_tipo_boat='PENDENTE' OR fk_tipo_boat = 'CORREÇÃO') LIMIT 1";
				$result = $conn->prepare($smtm);
				$result->bindParam(':boat', $fk_boat, PDO::PARAM_STR);
				$result->execute();

				if ($result->rowCount()) {

					// Passo 1: Dividir a string usando o delimitador %%
					$rawImages = explode(',', $_POST['img']);

					// Passo 2: Criar um array para armazenar as imagens válidas
					$validImages = [];

					foreach ($rawImages as $image) {
						// Remover espaços em branco
						$trimmedImage = $image;

						// Ignorar partes vazias
						if (empty($trimmedImage)) {
							continue;
						}

						// Tentar decodificar a Base64
						$decoded = base64_decode($trimmedImage);

						// Verificar se a decodificação foi bem-sucedida e se o conteúdo é binário
						if ($decoded !== false && strlen($decoded) > 0) {
							$validImages[] = $trimmedImage; // Armazenar diretamente no array principal
						}
					}
					
					$countImg = count($validImages);
						
					for ($i=0; $i < $countImg; $i++) {
						$query = "INSERT INTO anexos (fk_boat, path, created) 
									VALUES (:fk_boat, :path, DATE_SUB(now(), INTERVAL 3 HOUR))";
						$inserir = $conn->prepare($query);
						$inserir->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
									
						if (!$validImages[$i] == '') {
							$nameImg = "foto_".$i.".jpg";
							$output = $assets.$nameImg;
							file_put_contents($output, base64_decode($validImages[$i]));
							$inserir->bindParam(':path', $output, PDO::PARAM_STR);

						}else {
							$vazio = "";
							$inserir->bindParam(':path', $vazio, PDO::PARAM_STR);
						}
						$inserir->execute();
					}
					echo "FOTOS SALVAS COM SUCESSO!";
				
				}else {
					echo "SEM PERMISSÃO PARA INSERIR FOTOS, BOLETIM JÁ FINALIZADO, ENTRE EM CONTATO COM A COORDENAÇÃO";
				}

					
			}elseif (isset($_POST['update'])) {
				// Passo 1: Dividir a string usando o delimitador %%
				$rawImages = explode(',', $_POST['img']);

				// Passo 2: Criar um array para armazenar as imagens válidas
				$validImages = [];

				foreach ($rawImages as $image) {
					// Remover espaços em branco
					$trimmedImage = $image;

					// Ignorar partes vazias
					if (empty($trimmedImage)) {
						continue;
					}

					// Tentar decodificar a Base64
					$decoded = base64_decode($trimmedImage);

					// Verificar se a decodificação foi bem-sucedida e se o conteúdo é binário
					if ($decoded !== false && strlen($decoded) > 0) {
						$validImages[] = $trimmedImage; // Armazenar diretamente no array principal
					}
				}
				
				$countImg = count($validImages);
					
				for ($i=0; $i < $countImg; $i++) {
					$query = "INSERT INTO anexos (fk_boat, path, created) 
								VALUES (:fk_boat, :path, DATE_SUB(now(), INTERVAL 3 HOUR))";
					$inserir = $conn->prepare($query);
					$inserir->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
								
					if (!$validImages[$i] == '') {
						$nameImg = "foto_up_".$i.".jpg";
						$output = $assets.$nameImg;
						file_put_contents($output, base64_decode($validImages[$i]));
						$inserir->bindParam(':path', $output, PDO::PARAM_STR);

					}else {
						$vazio = "";
						$inserir->bindParam(':path', $vazio, PDO::PARAM_STR);
					}
					$inserir->execute();
				}
				echo "FOTOS ATUALIZADAS COM SUCESSO!";
				

			}elseif (isset($_POST['delete'])) {
				$query = "UPDATE anexos SET  delete_at=:delete_at, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE id_anexo=:id_anexo";
				$inserir = $conn->prepare($query);
				$inserir->bindParam(':id_anexo', $_POST['id_anexo'], PDO::PARAM_INT);
				$inserir->bindValue(':delete_at', 1, PDO::PARAM_INT);
				if ($inserir->execute()) {
					echo $_POST['id_anexo'];
				}else {
					echo false;
				}

			}	
		
		//Relatos
		}elseif ($_POST['insert_relato']) {

			if (!is_dir($assets)) {
				mkdir('../anexo_relatos/' . date('Y') . '/'.date('m').'/'.$fk_boat.'/', 0777, true);
			}
			$assets ='../anexo_relatos/'. date('Y') . '/'.date('m').'/'.$fk_boat.'/';
			
			if (isset($_POST['insert'])) {

				
				$smtm = "SELECT boat FROM boats WHERE boat=:boat AND (fk_tipo_boat='PENDENTE' OR fk_tipo_boat = 'CORREÇÃO') LIMIT 1";
				$result = $conn->prepare($smtm);
				$result->bindParam(':boat', $fk_boat, PDO::PARAM_STR);
				$result->execute();

				if ($result->rowCount()) {

					// Passo 1: Dividir a string usando o delimitador %%
					$rawImages = explode(',', $_POST['img']);

					// Passo 2: Criar um array para armazenar as imagens válidas
					$validImages = [];

					foreach ($rawImages as $image) {
						// Remover espaços em branco
						$trimmedImage = $image;

						// Ignorar partes vazias
						if (empty($trimmedImage)) {
							continue;
						}

						// Tentar decodificar a Base64
						$decoded = base64_decode($trimmedImage);

						// Verificar se a decodificação foi bem-sucedida e se o conteúdo é binário
						if ($decoded !== false && strlen($decoded) > 0) {
							$validImages[] = $trimmedImage; // Armazenar diretamente no array principal
						}
					}
					
					$countImg = count($validImages);
						
					for ($i=0; $i < $countImg; $i++) {
						$query = "INSERT INTO anexos_relatos (fk_boat, path, created) 
									VALUES (:fk_boat, :path, DATE_SUB(now(), INTERVAL 3 HOUR))";
						$inserir = $conn->prepare($query);
						$inserir->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
									
						if (!$validImages[$i] == '') {
							$nameImg = "foto_".$i.".jpg";
							$output = $assets.$nameImg;
							file_put_contents($output, base64_decode($validImages[$i]));
							$inserir->bindParam(':path', $output, PDO::PARAM_STR);

						}else {
							$vazio = "";
							$inserir->bindParam(':path', $vazio, PDO::PARAM_STR);
						}
						$inserir->execute();
					}
					echo "RELATOS SALVOS COM SUCESSO!";

				}else {
					echo "SEM PERMISSÃO PARA INSERIR FOTOS, BOLETIM JÁ FINALIZADO, ENTRE EM CONTATO COM A COORDENAÇÃO";
				}
		
					
			}elseif (isset($_POST['update'])) {
				// Passo 1: Dividir a string usando o delimitador %%
				$rawImages = explode(',', $_POST['img']);

				// Passo 2: Criar um array para armazenar as imagens válidas
				$validImages = [];

				foreach ($rawImages as $image) {
					// Remover espaços em branco
					$trimmedImage = $image;

					// Ignorar partes vazias
					if (empty($trimmedImage)) {
						continue;
					}

					// Tentar decodificar a Base64
					$decoded = base64_decode($trimmedImage);

					// Verificar se a decodificação foi bem-sucedida e se o conteúdo é binário
					if ($decoded !== false && strlen($decoded) > 0) {
						$validImages[] = $trimmedImage; // Armazenar diretamente no array principal
					}
				}
				
				$countImg = count($validImages);
					
				for ($i=0; $i < $countImg; $i++) {
					$query = "INSERT INTO anexos_relatos (fk_boat, path, created) 
								VALUES (:fk_boat, :path, DATE_SUB(now(), INTERVAL 3 HOUR))";
					$inserir = $conn->prepare($query);
					$inserir->bindParam(':fk_boat', $fk_boat, PDO::PARAM_STR);
								
					if (!$validImages[$i] == '') {
						$nameImg = "foto_up_".$i.".jpg";
						$output = $assets.$nameImg;
						file_put_contents($output, base64_decode($validImages[$i]));
						$inserir->bindParam(':path', $output, PDO::PARAM_STR);

					}else {
						$vazio = "";
						$inserir->bindParam(':path', $vazio, PDO::PARAM_STR);
					}
					$inserir->execute();
				}
				echo "RELATOS ATUALIZADOS COM SUCESSO!";

			}elseif (isset($_POST['delete'])) {
				$query = "UPDATE anexos_relatos SET delete_at=:delete_at, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE id_relato=:id_relato";
				$inserir = $conn->prepare($query);
				$inserir->bindParam(':id_relato', $_POST['id_relato'], PDO::PARAM_INT);
				$inserir->bindValue(':delete_at', 1, PDO::PARAM_INT);
				if ($inserir->execute()) {
					echo $_POST['id_relato'];
				}else {
					echo false;
				}

			}
			
		}
	}
	
	
}else {
	echo "SEM PERMISÃO PARA ACESSO!";
}
?>