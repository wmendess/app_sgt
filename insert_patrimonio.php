<?php
include_once 'conexao.php';

$SQLKEY= "w.mendessmtt63761";

if ($_POST['key']==$SQLKEY) {
    $patrimonio = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    $vazio = "";

    $query_pes_patrimonio = "SELECT fk_boat FROM patrimonios WHERE fk_boat=:fk_boat LIMIT 1";
    $pes_patrimonio = $conn->prepare($query_pes_patrimonio);
    $pes_patrimonio->bindParam(':fk_boat', $patrimonio['fk_boat'], PDO::PARAM_STR);
    $pes_patrimonio->execute();

    if (!empty($patrimonio['fk_boat'])) {
        if (($pes_patrimonio) && ($pes_patrimonio->rowCount() == 0)) {
            $query = "INSERT INTO patrimonios (fk_boat, proprietario, cpf_patri, rg_patri, telefone_pro_patri, idade_pro_patri, estado_civil_patri, sexo_patri, end_pro_patri, bairro_pro_patri, cidade_pro_patri, estado_pro_patri, nacionalidade_pro_patri, tipo_patri, natureza_patri, outros_patri, avarias_patri, created) VALUES (:fk_boat,:proprietario, :cpf_patri, :rg_patri, :telefone_pro_patri, :idade_pro_patri, :estado_civil_patri, :sexo_patri, :end_pro_patri, :bairro_pro_patri, :cidade_pro_patri, :estado_pro_patri, :nacionalidade_pro_patri, :tipo_patri, :natureza_patri, :outros_patri, :avarias_patri, DATE_SUB(now(), INTERVAL 3 HOUR))";
            $result = $conn->prepare($query);
            $result->bindParam(':fk_boat', $patrimonio['fk_boat'], PDO::PARAM_STR);
            $proprietario =strtoupper($patrimonio['proprietario']);
            $result->bindParam(':proprietario', $proprietario, PDO::PARAM_STR);
            $result->bindParam(':cpf_patri', $patrimonio['cpf_patri'], PDO::PARAM_STR);
            $result->bindParam(':rg_patri', $patrimonio['rg_patri'], PDO::PARAM_STR);
            $result->bindParam(':telefone_pro_patri', $patrimonio['telefone_pro_patri'], PDO::PARAM_STR);
            $result->bindParam(':idade_pro_patri', $patrimonio['idade_pro_patri'], PDO::PARAM_STR);
            if ($patrimonio['estado_civil_patri'] =='') {
                $result->bindParam(':estado_civil_patri', $vazio, PDO::PARAM_STR);
            }else {
                $result->bindParam(':estado_civil_patri', $patrimonio['estado_civil_patri'], PDO::PARAM_STR);
            } 
            if ($patrimonio['sexo_patri'] =='') {
                $result->bindParam(':sexo_patri', $vazio, PDO::PARAM_STR);
            }else {
                $result->bindParam(':sexo_patri', $patrimonio['sexo_patri'], PDO::PARAM_STR);
            } 
            $end_pro_patri = strtoupper($patrimonio['end_pro_patri']);
            $result->bindParam(':end_pro_patri', $end_pro_patri, PDO::PARAM_STR);
            $bairro_pro_patri = strtoupper($patrimonio['bairro_pro_patri']);
            $result->bindParam(':bairro_pro_patri', $bairro_pro_patri, PDO::PARAM_STR);
            $cidade_pro_patri = strtoupper($patrimonio['cidade_pro_patri']);
            $result->bindParam(':cidade_pro_patri', $cidade_pro_patri, PDO::PARAM_STR);
            if ($patrimonio['estado_pro_patri'] =='') {
                $result->bindParam(':estado_pro_patri', $vazio, PDO::PARAM_STR);
            }else {
                $result->bindParam(':estado_pro_patri', $estado_pro_patri, PDO::PARAM_STR);
            } 
            $nacionalidade_pro_patri = strtoupper($patrimonio['nacionalidade_pro_patri']);
            $result->bindParam(':nacionalidade_pro_patri', $nacionalidade_pro_patri, PDO::PARAM_STR);
            $result->bindParam(':tipo_patri', $patrimonio['tipo_patri'], PDO::PARAM_STR);
            $result->bindParam(':natureza_patri', $patrimonio['natureza_patri'], PDO::PARAM_STR);
            $outros_patri = strtoupper($patrimonio['outros_patri']);
            $result->bindParam(':outros_patri', $outros_patri, PDO::PARAM_STR);
            $avarias_patri = strtoupper($patrimonio['avarias_patri']);
            $result->bindParam(':avarias_patri', $avarias_patri, PDO::PARAM_STR);
            $result->execute();
            if ($result->rowCount()) { 
                echo "PATRIMÔNIO SALVO COM SUCESSO!";
            }else{
                echo "PATRIMÔNIO NÃO SALVO!";
            } 
        }else {
            $query_patrimonio_edit = "UPDATE patrimonios SET fk_boat=:fk_boat, proprietario=:proprietario, cpf_patri=:cpf_patri, rg_patri=:rg_patri, telefone_pro_patri=:telefone_pro_patri, idade_pro_patri=:idade_pro_patri, estado_civil_patri=:estado_civil_patri, sexo_patri=:sexo_patri, end_pro_patri=:end_pro_patri, bairro_pro_patri=:bairro_pro_patri, cidade_pro_patri=:cidade_pro_patri, estado_pro_patri=:estado_pro_patri, nacionalidade_pro_patri=:nacionalidade_pro_patri, tipo_patri=:tipo_patri, natureza_patri=:natureza_patri, outros_patri=:outros_patri, avarias_patri=:avarias_patri, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE fk_boat=:fk_boat";
            $result = $conn->prepare($query_patrimonio_edit);
            $result->bindParam(':fk_boat', $patrimonio['fk_boat'], PDO::PARAM_STR);
            $proprietario =strtoupper($patrimonio['proprietario']);
            $result->bindParam(':proprietario', $proprietario, PDO::PARAM_STR);
            $result->bindParam(':cpf_patri', $patrimonio['cpf_patri'], PDO::PARAM_STR);
            $result->bindParam(':rg_patri', $patrimonio['rg_patri'], PDO::PARAM_STR);
            $result->bindParam(':telefone_pro_patri', $patrimonio['telefone_pro_patri'], PDO::PARAM_STR);
            $result->bindParam(':idade_pro_patri', $patrimonio['idade_pro_patri'], PDO::PARAM_STR);
            if ($patrimonio['estado_civil_patri'] =='') {
                $result->bindParam(':estado_civil_patri', $vazio, PDO::PARAM_STR);
            }else {
                $result->bindParam(':estado_civil_patri', $patrimonio['estado_civil_patri'], PDO::PARAM_STR);
            } 
            if ($patrimonio['sexo_patri'] =='') {
                $result->bindParam(':sexo_patri', $vazio, PDO::PARAM_STR);
            }else {
                $result->bindParam(':sexo_patri', $patrimonio['sexo_patri'], PDO::PARAM_STR);
            }
            if ($patrimonio['estado_pro_patri'] =='') {
                $result->bindParam(':estado_pro_patri', $vazio, PDO::PARAM_STR);
            }else {

                $result->bindParam(':estado_pro_patri', $patrimonio['estado_pro_patri'], PDO::PARAM_STR);
            } 
            $end_pro_patri = strtoupper($patrimonio['end_pro_patri']);
            $result->bindParam(':end_pro_patri', $end_pro_patri, PDO::PARAM_STR);
            $bairro_pro_patri = strtoupper($patrimonio['bairro_pro_patri']);
            $result->bindParam(':bairro_pro_patri', $bairro_pro_patri, PDO::PARAM_STR);
            $cidade_pro_patri = strtoupper($patrimonio['cidade_pro_patri']);
            $result->bindParam(':cidade_pro_patri', $cidade_pro_patri, PDO::PARAM_STR);
            $nacionalidade_pro_patri = strtoupper($patrimonio['nacionalidade_pro_patri']);
            $result->bindParam(':nacionalidade_pro_patri', $nacionalidade_pro_patri, PDO::PARAM_STR);
            $result->bindParam(':tipo_patri', $patrimonio['tipo_patri'], PDO::PARAM_STR);
            $result->bindParam(':natureza_patri', $patrimonio['natureza_patri'], PDO::PARAM_STR);
            $outros_patri = strtoupper($patrimonio['outros_patri']);
            $result->bindParam(':outros_patri', $outros_patri, PDO::PARAM_STR);
            $avarias_patri = strtoupper($patrimonio['avarias_patri']);
            $result->bindParam(':avarias_patri', $avarias_patri, PDO::PARAM_STR);
            $result->execute();
            if ($result->rowCount() > 0) {
                echo "PATRIMÔNIO EDITADO COM SUCESSO!";
            }else {
                echo "PATRIMÔNIO NÃO EDITADO!";
            }
        }   
    }else {
        echo "Erro: Primeiramente preencha os dados da aba Boat e salve-os!";
    }

    
}else {
    echo "Sem permissão de acesso!";
}

