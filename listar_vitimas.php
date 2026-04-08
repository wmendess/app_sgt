<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {
    
    if (!empty($_GET['boat'])) {
        $boatpes = $_GET['boat'];
        $query_vit = "SELECT * FROM vitimas WHERE fk_boat=:fk_boat";
        $result_vit = $conn->prepare($query_vit);
        $result_vit->bindParam(':fk_boat', $boatpes, PDO::PARAM_STR);
        $result_vit->execute();
        if ($result_vit->rowCount()) {
            $dados_vitimas = [];
            while($row_vitimas = $result_vit->fetch(PDO::FETCH_OBJ)){
                $dados_vitimas[] = $row_vitimas;
            }
            echo json_encode($dados_vitimas);
        }else {
            echo "NENHUMA VÍTIMA ADICIONADA!";
        }
    }else {
        echo "Erro ao buscar vitima!";
    }
}else {
    echo "Sem Permissão para acesso!";
}