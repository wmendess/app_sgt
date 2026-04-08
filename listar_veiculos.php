<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {
    
    if (!empty($_GET['boat'])) {
        $boatpes = $_GET['boat'];
        $query_ve = "SELECT * FROM veiculos WHERE fk_boat=:fk_boat";
        $result_ve = $conn->prepare($query_ve);
        $result_ve->bindParam(':fk_boat', $boatpes, PDO::PARAM_STR);
        $result_ve->execute();
        if ($result_ve->rowCount()) {
            $dados_veiculos = [];
            while($row_veiculos = $result_ve->fetch(PDO::FETCH_OBJ)){
            $dados_veiculos[] = $row_veiculos;
            }
            echo json_encode($dados_veiculos);
        } else {
            echo "NENHUM VEICULO ADICIONADO!";
        }
    }else {
    echo "Erro ao buscar veiculo!";
    }
}else {
    echo "Sem permissão de acesso!";
}


