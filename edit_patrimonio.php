<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {
    
    if (!empty($_GET['boat'])) {
        $boatpes = $_GET['boat'];
        $query_patrimonio = "SELECT * FROM patrimonios WHERE fk_boat=:fk_boat";
        $result_patrimonio = $conn->prepare($query_patrimonio);
        $result_patrimonio->bindParam(':fk_boat', $boatpes, PDO::PARAM_STR);
        $result_patrimonio->execute();
        if (($result_patrimonio) && ($result_patrimonio->rowCount() == 1)) {
            $dados_patrimonio = [];
            $row_patrimonio = $result_patrimonio->fetch(PDO::FETCH_OBJ);
            $dados_patrimonio[] = $row_patrimonio;
            echo json_encode($dados_patrimonio);
        }
    }else {
    echo "Erro ao buscar patrimonio!";
    }
}else {
    echo "Sem permissão de acesso!";
}


