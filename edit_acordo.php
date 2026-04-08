<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {
    
    if (!empty($_GET['boat'])) {
        $boatpes = $_GET['boat'];
        $query_acordo = "SELECT * FROM acordos WHERE fk_boat=:fk_boat";
        $result_acordo = $conn->prepare($query_acordo);
        $result_acordo->bindParam(':fk_boat', $boatpes, PDO::PARAM_STR);
        $result_acordo->execute();
        if (($result_acordo) && ($result_acordo->rowCount() == 1)) {
            $dados_acordo = [];
            $row_acordo = $result_acordo->fetch(PDO::FETCH_OBJ);
            $dados_acordo[] = $row_acordo;
            echo json_encode($dados_acordo);
        }
    }else {
    echo "Erro ao buscar acordo!";
    }
}else {
    echo "Sem permissão de acesso!";
}


