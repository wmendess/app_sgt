<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {
    
    $query = "SELECT id_anexo, fk_boat, path FROM anexos WHERE fk_boat=:fk_boat";
    $result = $conn->prepare($query);
    $result->bindParam(':fk_boat', $_GET['fk_boat'], PDO::PARAM_STR);
    $resultado = [];
    $result->execute();
    if ($result->rowCount()) {
        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            $idCheck = $row['id_anexo']; // Identificador único da tabela check
    
            // Verifica se o id_check já existe no array resultado
            if (!isset($resultado[$idCheck])) {
                // Cria a estrutura inicial para este id_check
                $resultado[$idCheck] = [
                    'photos' => []   // Array vazio para as fotos
                ];
            }
    
            // Se houver dados na tabela check_photo, adiciona ao array photos
            if ($row['fk_boat'] !== null) {
                $resultado[$idCheck]['photos'][] = [
                    'id_anexo' => $row['id_anexo'],
                    'path' => $row['path']
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
    
}else {
    echo "Sem permissão de acesso!";
}

