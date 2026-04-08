<?php 
include "../config/conexao.php";
$SQLKEY = "w.mendessmtt63761";

	if ((isset($_POST['key']) &&  $_POST['key'] == $SQLKEY) || (isset($_GET['key']) && $_GET['key'] == $SQLKEY)) {
		if (isset($_GET['agente'])) {

			if ($_GET['funcao'] == 6) {
				$smtm = "SELECT r.id_remocao, r.data, r.patio, r.hora, r.controle, r.acidente, r.placa, r.chassi, 
					r.modelo, r.cor, r.local, r.bairro, r.ponto_referencia, r.infracao, r.codigo, r.guincho, r.km, r.avarias, r.obs_remocao, 
					p.id_photo, p.fk_remocao, p.path 
					FROM ( SELECT * FROM remocao WHERE status = 'REMOVIDO' ORDER BY id_remocao DESC LIMIT 20) AS r
					LEFT JOIN remocoes_photos AS p ON r.id_remocao = p.fk_remocao";
				$result = $conn->prepare($smtm);
				$result->execute();
				$resultado = [];
				if ($result->rowCount()) {
				   
					while($row = $result->fetch(PDO::FETCH_ASSOC)){
						$idRemocao = $row['id_remocao']; // Identificador único da tabela remocao
			
						// Verifica se o id_remocao já existe no array resultado
						if (!isset($resultado[$idRemocao])) {
							// Cria a estrutura inicial para este id_remocao
							$resultado[$idRemocao] = [
								'remocao' => [
									'id_remocao' => $row['id_remocao'],
									'data' => $row['data'],
									'patio' => $row['patio'],
									'hora' => $row['hora'],
									'controle' => $row['controle'],
									'acidente' => $row['acidente'],
									'placa' => $row['placa'],
									'chassi' => $row['chassi'],
									'modelo' => $row['modelo'],
									'cor' => $row['cor'],
									'local' => $row['local'],
									'bairro' => $row['bairro'],
									'ponto_referencia' => $row['ponto_referencia'],
									'infracao' => $row['infracao'],
									'codigo' => $row['codigo'],
									'guincho' => $row['guincho'],
									'km' => $row['km'],
									'avarias' => $row['avarias'],
									'obs_remocao' => $row['obs_remocao'],
								], 
								'photos' => []   // Array vazio para as fotos
							];
						}
				
						// Se houver dados na tabela remocao_photo, adiciona ao array photos
						if ($row['fk_remocao'] !== null) {
							$resultado[$idRemocao]['photos'][] = [
								'id_photo' => $row['id_photo'],
								'path' => $row['path']
							];
						}
					}
					// Remove as chaves numéricas do array principal, mantendo apenas os valores
					$resultado = array_values($resultado);
				
					// Exibe o resultado final
					echo json_encode($resultado);
				} else {
					echo "NENHUMA REMOÇÃO ENCONTRADA!";
				}
			}else {
				$smtm = "SELECT 
						r.id_remocao, r.data, r.patio, r.hora, r.controle, r.acidente, r.placa, r.chassi, 
						r.modelo, r.cor, r.local, r.bairro, r.ponto_referencia, r.infracao, r.codigo, r.guincho, r.km, r.avarias, r.obs_remocao,
						p.id_photo, p.fk_remocao, p.path 
						FROM ( SELECT * FROM remocao WHERE status = 'REMOVIDO' AND agente = :agente AND delete_at=:delete_at ORDER BY id_remocao DESC LIMIT 20) AS r
						LEFT JOIN remocoes_photos AS p ON r.id_remocao = p.fk_remocao";				
				$result = $conn->prepare($smtm);
				$result->bindParam(':agente', $_GET['agente'], PDO::PARAM_STR);
				$result->bindValue(':delete_at', 1, PDO::PARAM_INT);
				$result->execute();
				$resultado = [];
				if ($result->rowCount()) {
				   
					while($row = $result->fetch(PDO::FETCH_ASSOC)){
						$idRemocao = $row['id_remocao']; // Identificador único da tabela remocao
			
						// Verifica se o id_remocao já existe no array resultado
						if (!isset($resultado[$idRemocao])) {
							// Cria a estrutura inicial para este id_remocao
							$resultado[$idRemocao] = [
								'remocao' => [
									'id_remocao' => $row['id_remocao'],
									'data' => $row['data'],
									'patio' => $row['patio'],
									'hora' => $row['hora'],
									'controle' => $row['controle'],
									'acidente' => $row['acidente'],
									'placa' => $row['placa'],
									'chassi' => $row['chassi'],
									'modelo' => $row['modelo'],
									'cor' => $row['cor'],
									'local' => $row['local'],
									'bairro' => $row['bairro'],
									'ponto_referencia' => $row['ponto_referencia'],
									'infracao' => $row['infracao'],
									'codigo' => $row['codigo'],
									'guincho' => $row['guincho'],
									'km' => $row['km'],
									'avarias' => $row['avarias'],
									'obs_remocao' => $row['obs_remocao'],
								], 
								'photos' => []   // Array vazio para as fotos
							];
						}
				
						// Se houver dados na tabela remocao_photo, adiciona ao array photos
						if ($row['fk_remocao'] !== null) {
							$resultado[$idRemocao]['photos'][] = [
								'id_photo' => $row['id_photo'],
								'path' => $row['path']
							];
						}
					}
					// Remove as chaves numéricas do array principal, mantendo apenas os valores
					$resultado = array_values($resultado);
				
					// Exibe o resultado final
					echo json_encode($resultado);
				} else {
					echo "NENHUMA REMOÇÃO ENCONTRADA!";
				}
			}
		
		}else {

			$dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
			
			if (isset($dados['insert'])) {
				$smtm = "SELECT COUNT(*) FROM remocao WHERE data = :data AND placa = :placa";
				$result = $conn->prepare($smtm);
				$result->bindParam(':data', $dados['data'], PDO::PARAM_STR);
				$result->bindParam(':placa', $dados['placa'], PDO::PARAM_STR);
				$result->execute();
				//$row = $result->fetch(PDO::FETCH_ASSOC);
				if (($dados['placa'] != "") && ($result->fetchColumn() > 0)) {
					echo "FICHA DE REMOCAO JA REALIZADA DESSE VEICULO!";
				}else {
					// Gerar numero da ficha
					$fichaStmt = $conn->query("SELECT COALESCE(MAX(n_ficha), 0) + 1 as n_ficha FROM remocao");
					$n_ficha = $fichaStmt->fetch(PDO::FETCH_ASSOC)['n_ficha'];
	
					// Passo 1: Dividir a string usando o delimitador ,
					$rawImages = explode(',', $dados['img']);
	
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
					$controle = date('ymdHis');
	
					$query = "INSERT INTO remocao (n_ficha, data, hora, patio, controle, acidente, abandonado, placa, chassi, modelo, cor, local, bairro, ponto_referencia, infracao, codigo, agente, matricula, guincho, km, avarias, obs_remocao, fk_setor, created) VALUES (:n_ficha, :data, :hora, :patio, :controle, :acidente, :abandonado, :placa, :chassi, :modelo, :cor, :local, :bairro, :ponto_referencia, :infracao, :codigo, :agente, :matricula, :guincho, :km, :avarias, :obs_remocao, :fk_setor, now())";
					$params = [
						':n_ficha' => $n_ficha,
						':data' => $dados['data'],
						':hora' => $dados['hora'],
						':patio' => $dados['patio'],
						':controle' => $controle,
						':acidente' => $dados['acidente'],
						':abandonado' => $dados['abandonado'],
						':placa' => $dados['placa'],
						':chassi' => strtoupper($dados['chassi']),
						':modelo' => $dados['modelo'],
						':cor' => strtoupper($dados['cor']),
						':local' => strtoupper($dados['local']),
						':bairro' => strtoupper($dados['bairro']),
						':ponto_referencia' => strtoupper($dados['ponto_referencia']),
						':infracao' => strtoupper($dados['infracao']),
						':codigo' => $dados['codigo'],
						':agente' => $dados['agente'],
						':matricula' => $dados['matricula'],
						':guincho' => strtoupper($dados['guincho']),
						':km' => $dados['km'],
						':avarias' => strtoupper($dados['avarias']),
						':obs_remocao' => strtoupper($dados['observacao']),
						':fk_setor' => $dados['setor'],
					];
					
					$inserir = $conn->prepare($query);
					if ($inserir->execute($params)) {
						// Inserir imagens
						
						$assets = '../assets/remocao/'. date('Y') . '/'.date('m').'/'.$controle.'/';
						if (!is_dir($assets)) {
							mkdir($assets, 0777, true);
						}
					
						$last_id = $conn->lastInsertId();
						$countImg = count($validImages);
						
						for ($i=0; $i < $countImg; $i++) {
							$query_img = "INSERT INTO remocoes_photos (fk_remocao, path, created) 
											VALUES (:fk_remocao, :path, now())";
							$cad_img =  $conn->prepare($query_img);
							$cad_img->bindParam(':fk_remocao', $last_id, PDO::PARAM_INT);
							if (!$validImages[$i] == '') {
								$nameImg = $controle."_".$i.".jpg";
								$output = $assets.$nameImg;
								file_put_contents($output, base64_decode($validImages[$i]));
								$cad_img->bindParam(':path', $output, PDO::PARAM_STR);
			
							}else {
								$vazio = "";
								$cad_img->bindParam(':path', $vazio, PDO::PARAM_STR);
							}
							$cad_img->execute();
						}
						echo "REMOCÃO SALVA!";
					} else {
						echo "REMOCÃO NÃO SALVA!";
					}
				}
	
			}elseif (isset($dados['update'])) {
				$query = "UPDATE remocao SET patio=:patio, data=:data, hora=:hora, acidente=:acidente, abandonado=:abandonado, placa=:placa, chassi=:chassi, modelo=:modelo, cor=:cor, 
											local=:local, bairro=:bairro, ponto_referencia=:ponto_referencia, infracao=:infracao, codigo=:codigo, guincho=:guincho, km=:km, avarias=:avarias, obs_remocao=:obs_remocao, modified=now() WHERE id_remocao=:id_remocao";
				$params = [
					':id_remocao' => $dados['id_remocao'],
					':data' => $dados['data'],
					':hora' => $dados['hora'],
					':patio' => $dados['patio'],
					':acidente' => $dados['acidente'],
					':abandonado' => $dados['abandonado'],
					':placa' => $dados['placa'],
					':chassi' => strtoupper($dados['chassi']),
					':modelo' => $dados['modelo'],
					':cor' => strtoupper($dados['cor']),
					':local' => strtoupper($dados['local']),
					':bairro' => strtoupper($dados['bairro']),
					':ponto_referencia' => strtoupper($dados['ponto_referencia']),
					':infracao' => strtoupper($dados['infracao']),
					':codigo' => $dados['codigo'],
					':guincho' => strtoupper($dados['guincho']),
					':km' => $dados['km'],
					':avarias' => strtoupper($dados['avarias']),
					':obs_remocao' => strtoupper($dados['observacao']),
				];
				$inserir = $conn->prepare($query);
				if ($inserir->execute($params)) {
	
					// Passo 1: Dividir a string usando o delimitador ,
					$rawImages = explode(',', $dados['img']);
	
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
	
					// Inserir imagens
					$assets = '../assets/remocao/'. date('Y') . '/'.date('m').'/'.$dados['controle'].'/';
					if (!is_dir($assets)) {
						mkdir($assets, 0777, true);
					}
				
					$countImg = count($validImages);
					
					for ($i=0; $i < $countImg; $i++) {
						$query_img = "INSERT INTO remocoes_photos (fk_remocao, path, created) 
										VALUES (:fk_remocao, :path, now())";
						$cad_img =  $conn->prepare($query_img);
						$cad_img->bindParam(':fk_remocao', $dados['id_remocao'], PDO::PARAM_INT);
						if (!$validImages[$i] == '') {
							$nameImg = $dados['controle']."_up_".$i.".jpg";
							$output = $assets.$nameImg;
							file_put_contents($output, base64_decode($validImages[$i]));
							$cad_img->bindParam(':path', $output, PDO::PARAM_STR);
						}else {
							$vazio = "";
							$cad_img->bindParam(':path', $vazio, PDO::PARAM_STR);
						}
						$cad_img->execute();
						
					}
					echo "REMOCÃO ATUALIZADA COM SUCESSO!";
	
				}else {
					echo "REMOCÃO NÃO ATUALIZADA!";
				}
			}elseif (isset($dados['delete'])) {
				$query = "UPDATE remocoes_photos SET delete_at = :delete_at WHERE id_photo = :id";
				$result = $conn->prepare($query);
				$result->bindParam(':id', $dados['id_photo'], PDO::PARAM_INT);
				$result->bindValue(':delete_at', 1, PDO::PARAM_INT);
				if ($result->execute()) {
					echo $dados['id_photo'];
				}else {
					echo false;
				}
			}elseif (isset($dados['read'])) {
	
				$smtm = "SELECT id_remocao, data, placa, local, bairro, ponto_referencia FROM remocao WHERE agente=:agente AND data BETWEEN :data_inicio AND :data_fim ORDER BY data DESC";
				$result = $conn->prepare($smtm);
				$result->bindParam(':agente', $dados['agente'], PDO::PARAM_STR);
				$result->bindParam(':data_inicio', $dados['data_inicio'], PDO::PARAM_STR);
				$result->bindParam(':data_fim', $dados['data_fim'], PDO::PARAM_STR);
				$result->execute();
				if ($result->rowCount()) {
					$dados_remocao = [];
					while($row_remocao = $result->fetch(PDO::FETCH_OBJ)){
						$dados_remocao[] = $row_remocao;
					}
					echo json_encode($dados_remocao);
				} else {
					echo "NENHUMA REMOÇÃO ENCONTRADA!";
				}
			}
		
		}
	} else {
		
		echo "Sem permissão de acesso!";
   
	}
	
	
	
?>