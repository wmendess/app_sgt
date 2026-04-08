<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

    $boat = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        function gerarToken($length = 8) {
            $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, $charactersLength - 1)];
            }
            return $randomString;
        }
        $token = gerarToken();

        $consulta = "OK";
        $query_boat = "UPDATE boats SET fk_user=:fk_user, controle_boat=:controle_boat, viatura_boat=:viatura_boat, agente_boat=:agente_boat, matricula_boat=:matricula_boat, equipe_boat=:equipe_boat, data_registro=:data_registro, data_acidente=:data_sinistro, semana=:semana, h_ocorrido=:h_ocorrido, h_comunicado=:h_comunicado, h_chegada=:h_chegada, h_saida=:h_saida, local_boat=:local_boat, bairro_boat=:bairro_boat, ponto_referencia=:ponto_referencia, cidade_boat=:cidade_boat, tipo_acidente=:tipo_acidente, causa_acidente=:causa_acidente, pista=:pista, tipo_via=:tipo_via, cruzamento=:cruzamento, sinal_existente=:sinal_existente, estado_boat=:estado_boat, iluminacao=:iluminacao, pavimento=:pavimento, visibilidade=:visibilidade, tempo=:tempo, tipo_local1=:tipo_local1, tipo_local2=:tipo_local2, mao_pista=:mao_pista, latitude=:latitude, longitude=:longitude, consulta=:consulta, token=:token, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE boat=:boat";
        $result_boat = $conn->prepare($query_boat);
        $result_boat->bindParam(':boat', $boat['boat'], PDO::PARAM_STR);
        $result_boat->bindParam(':fk_user', $boat['fk_user'], PDO::PARAM_STR);
        $result_boat->bindParam(':controle_boat', $boat['controle_boat'], PDO::PARAM_STR);
        $result_boat->bindParam(':viatura_boat', $boat['viatura_boat'], PDO::PARAM_STR);
        $agente_boat = strtoupper($boat['agente_boat']);
        $result_boat->bindParam(':agente_boat', $agente_boat, PDO::PARAM_STR);
        $result_boat->bindParam(':matricula_boat', $boat['matricula_boat'], PDO::PARAM_STR);
        $result_boat->bindParam(':consulta', $consulta, PDO::PARAM_STR);
        $result_boat->bindParam(':equipe_boat', $boat['equipe_boat'], PDO::PARAM_STR);
        if ($boat['data_acidente']) {
            $result_boat->bindParam(':data_registro', $boat['data_acidente'], PDO::PARAM_STR);
            $result_boat->bindParam(':data_sinistro', $boat['data_acidente'], PDO::PARAM_STR);
        }else {
            $result_boat->bindParam(':data_registro', $boat['data_registro'], PDO::PARAM_STR);
            $result_boat->bindParam(':data_sinistro', $boat['data_sinistro'], PDO::PARAM_STR);
        }
        $result_boat->bindParam(':semana', $boat['semana'], PDO::PARAM_STR);
        $result_boat->bindParam(':h_ocorrido', $boat['h_ocorrido'], PDO::PARAM_STR);
        $result_boat->bindParam(':h_comunicado', $boat['h_comunicado'], PDO::PARAM_STR);
        $result_boat->bindParam(':h_chegada', $boat['h_chegada'], PDO::PARAM_STR);
        $result_boat->bindParam(':h_saida', $boat['h_saida'], PDO::PARAM_STR);
        $local = strtoupper($boat['local_boat']);
        $result_boat->bindParam(':local_boat', $local, PDO::PARAM_STR);
        $bairro = strtoupper($boat['bairro_boat']);
        $result_boat->bindParam(':bairro_boat', $bairro, PDO::PARAM_STR);
        $ponto_referencia = strtoupper($boat['ponto_referencia']);
        $result_boat->bindParam(':ponto_referencia', $ponto_referencia, PDO::PARAM_STR);
        $result_boat->bindParam(':cidade_boat', $boat['cidade_boat'], PDO::PARAM_STR);
        $result_boat->bindParam(':tipo_acidente', $boat['tipo_acidente'], PDO::PARAM_STR);
        $result_boat->bindParam(':causa_acidente', $boat['causa_acidente'], PDO::PARAM_STR);
        $result_boat->bindParam(':pista', $boat['pista'], PDO::PARAM_STR);
        $result_boat->bindParam(':tipo_via', $boat['tipo_via'], PDO::PARAM_STR);
        $result_boat->bindParam(':cruzamento', $boat['cruzamento'], PDO::PARAM_STR);
        $sinalizacao_existente = strtoupper($boat['sinal_existente']);
        $result_boat->bindParam(':sinal_existente', $sinalizacao_existente, PDO::PARAM_STR);
        $result_boat->bindParam(':estado_boat', $boat['estado_boat'], PDO::PARAM_STR);
        $result_boat->bindParam(':iluminacao',  $boat['iluminacao'], PDO::PARAM_STR);
        $result_boat->bindParam(':pavimento',  $boat['pavimento'], PDO::PARAM_STR);
        $result_boat->bindParam(':visibilidade', $boat['visibilidade'], PDO::PARAM_STR);
        $result_boat->bindParam(':tempo', $boat['tempo'], PDO::PARAM_STR);
        $result_boat->bindParam(':tipo_local1', $boat['tipo_local1'], PDO::PARAM_STR);
        $result_boat->bindParam(':tipo_local2', $boat['tipo_local2'], PDO::PARAM_STR);
        $result_boat->bindParam(':mao_pista', $boat['mao_pista'], PDO::PARAM_STR);
        $result_boat->bindParam(':latitude', $boat['latitude'], PDO::PARAM_STR);
        $result_boat->bindParam(':longitude', $boat['longitude'], PDO::PARAM_STR);
        $result_boat->bindParam(':token', $token, PDO::PARAM_STR);
        $result_boat->execute();       
        if ($result_boat->rowCount()) {
            echo "BOAT SALVO COM SUCESSO!";
        } else {
            echo "BOAT NÃO SALVO!";
        }
     
}else{
    echo "Sem permisão de acesso!";
}
