<?php

include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_GET['key'] == $SQLKEY) {

    if ($_GET['user'] == 'W.MENDES' || $_GET['user'] == 'GUSMAO' || $_GET['user'] == 'JULIARD' || $_GET['user'] == 'DOMINGOS' || $_GET['user'] == 'FRANCISCO') {
        $query_boat = "SELECT * FROM boats WHERE (fk_tipo_boat = 'PENDENTE' OR fk_tipo_boat = 'CORREÇÃO') ORDER BY boat DESC LIMIT 30";
        $result_boat = $conn->prepare($query_boat);
        $result_boat->execute();
        if ($result_boat->rowCount()) {
            $dados_boat = [];
            while($row_boat = $result_boat->fetch(PDO::FETCH_OBJ)){
            $dados_boat[] = $row_boat;
            }
            echo json_encode($dados_boat);
        } else {
            echo "NENHUM BOAT ENCONTRADO PARA EDIÇÃO!";
        } 
    }else {
        $query_boat = "SELECT * FROM boats WHERE (fk_tipo_boat = 'PENDENTE' OR fk_tipo_boat = 'CORREÇÃO') AND fk_user=:fk_user ORDER BY boat DESC";
        $result_boat = $conn->prepare($query_boat);
        $result_boat->bindParam(':fk_user', $_GET['user'], PDO::PARAM_STR);
        $result_boat->execute();
        if ($result_boat->rowCount()) {
            $dados_boat = [];
            while($row_boat = $result_boat->fetch(PDO::FETCH_OBJ)){
            $dados_boat[] = $row_boat;
            }
            echo json_encode($dados_boat);
        } else {
            echo "NENHUM BOAT ENCONTRADO PARA EDIÇÃO!";
        } 
    }
    

}else {
    echo "Sem permissão de acesso!";
}
