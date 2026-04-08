<?php


date_default_timezone_set('America/Sao_Paulo');

include_once 'conexao.php';
$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

 $consulta = "OK";
 $query_consult = "SELECT boat FROM boats WHERE agente_boat=:agente_boat AND consulta=:consulta";
 $consult_boat = $conn->prepare($query_consult);
 $consult_boat->bindParam(':agente_boat', $_POST['agente_boat'], PDO::PARAM_STR);
 $consult_boat->bindValue(':consulta', 'PENDENTE', PDO::PARAM_STR);
 $consult_boat->execute();
 $result = $consult_boat->fetch(PDO::FETCH_ASSOC);

    if (($consult_boat) && ($consult_boat->rowCount() == 0)) {
        $data = date('Y-m-d');
        $query_pes_boat = "SELECT MAX(boat) as n_boat FROM boats";
        $pes_boat = $conn->prepare($query_pes_boat);
        $pes_boat->execute();
        $boat = $pes_boat->fetch(PDO::FETCH_ASSOC);
            if (date('d') == 01) {
                if ((substr($boat['n_boat'], 0,-3)) == (date('ym'))) {
                    $n_boat = $boat['n_boat'] + 1;
                    $query_boat = "INSERT INTO boats (boat, fk_user, agente_boat, data_registro, data_acidente, consulta, created) VALUES (:boat, :fk_user, :agente_boat, :data_registro, :data_acidente, :consulta, DATE_SUB(now(), INTERVAL 3 HOUR))";
                    $result_boat = $conn->prepare($query_boat);
                    $result_boat->bindParam(':boat', $n_boat, PDO::PARAM_INT);
                    $result_boat->bindParam(':fk_user', $_POST['agente_boat'], PDO::PARAM_STR);
                    $result_boat->bindParam(':agente_boat', $_POST['agente_boat'], PDO::PARAM_STR);
                    $result_boat->bindParam(':data_registro', $data, PDO::PARAM_STR);
                    $result_boat->bindParam(':data_acidente', $data, PDO::PARAM_STR);
                    $result_boat->bindParam(':consulta', $consulta, PDO::PARAM_STR);
                    $result_boat->execute();
                    if ($result_boat->rowCount()) {
                        echo $n_boat;
                    } else {
                        echo $n_boat;
                    }
 
                }else {
                    $n_boat = date('ym').'000';
                    $query_boat = "INSERT INTO boats (boat, fk_user, agente_boat, data_registro, data_acidente, consulta, created) VALUES (:boat, :fk_user, :agente_boat, :data_registro, :data_acidente, :consulta, DATE_SUB(now(), INTERVAL 3 HOUR))";
                    $result_boat = $conn->prepare($query_boat);
                    $result_boat->bindParam(':boat', $n_boat, PDO::PARAM_INT);
                    $result_boat->bindParam(':fk_user', $_POST['agente_boat'], PDO::PARAM_STR);
                    $result_boat->bindParam(':agente_boat', $_POST['agente_boat'], PDO::PARAM_STR);
                    $result_boat->bindParam(':data_registro', $data, PDO::PARAM_STR);
                    $result_boat->bindParam(':data_acidente', $data, PDO::PARAM_STR);
                    $result_boat->bindParam(':consulta', $consulta, PDO::PARAM_STR);
                    $result_boat->execute();
                    if ($result_boat->rowCount()) {
                        echo $n_boat;
                    } else {
                        echo $n_boat;
                    }
                
                }
            }else {
                $n_boat = $boat['n_boat'] + 1;  
                $query_boat = "INSERT INTO boats (boat, fk_user, agente_boat, data_registro, data_acidente, consulta, created) VALUES (:boat, :fk_user, :agente_boat, :data_registro, :data_acidente, :consulta, DATE_SUB(now(), INTERVAL 3 HOUR))";
                $result_boat = $conn->prepare($query_boat);
                $result_boat->bindParam(':boat', $n_boat, PDO::PARAM_INT);
                $result_boat->bindParam(':fk_user', $_POST['agente_boat'], PDO::PARAM_STR);
                $result_boat->bindParam(':agente_boat', $_POST['agente_boat'], PDO::PARAM_STR);
                $result_boat->bindParam(':data_registro', $data, PDO::PARAM_STR);
                $result_boat->bindParam(':data_acidente', $data, PDO::PARAM_STR);
                $result_boat->bindParam(':consulta', $consulta, PDO::PARAM_STR);
                $result_boat->execute();
                if ($result_boat->rowCount()) {
                    echo $n_boat;
                } else {
                    echo $n_boat;
                }
            }
        
    
    } else {
        echo 'FINALIZE O BOAT DE N° '.$result['boat'].', PARA PROSEGUIR COM UM NOVO BOAT';
        
    }

}else {
    echo "Sem permisão de acesso!";
}



