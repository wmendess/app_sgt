<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {
    
    if (!empty($_GET['boat'])) {
        $boatpes = $_GET['boat'];
        $query_relatorio = "SELECT * FROM relatorios WHERE fk_boat=:fk_boat";
        $result_relatorio = $conn->prepare($query_relatorio);
        $result_relatorio->bindParam(':fk_boat', $boatpes, PDO::PARAM_STR);
        $result_relatorio->execute();
        if (($result_relatorio) && ($result_relatorio->rowCount() == 1)) {
            $dados_relatorio = [];
            $row_relatorio = $result_relatorio->fetch(PDO::FETCH_OBJ);
            $dados_relatorio[] = $row_relatorio;
            echo json_encode($dados_relatorio);
        }
    }else {
    echo "Erro ao buscar relatorio!";
    }
}else {
    echo "Sem permissão de acesso!";
}


