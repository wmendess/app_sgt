<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {
     
    $vitima = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    $vazio = "";

    $query_pes_vitima = "SELECT fk_boat, unidade_vit FROM vitimas WHERE fk_boat=:fk_boat AND unidade_vit=:unidade_vit LIMIT 1";
    $pes_vitima = $conn->prepare($query_pes_vitima);
    $pes_vitima->bindParam(':fk_boat', $vitima['fk_boat'], PDO::PARAM_STR);
    $pes_vitima->bindParam(':unidade_vit', $vitima['unidade_vit'], PDO::PARAM_STR);
    $pes_vitima->execute();

    if (($pes_vitima) && ($pes_vitima->rowCount() == 0)) {
        
        if (!empty($vitima['fk_boat'])) {

            $query = "INSERT INTO vitimas (fk_boat, unidade_vit, nome_vit, endereco_vit, bairro_vit, cidade_vit, estado_vit, nacionalidade_vit, telefone_vit, idade_vit, estado_civil_vit, sexo_vit, condicao_vit, ferimentos_vit, veiculo_vitima, observacao_vit, created) VALUES (:fk_boat, :unidade_vit, :nome_vit, :endereco_vit, :bairro_vit, :cidade_vit, :estado_vit, :nacionalidade_vit, :telefone_vit, :idade_vit, :estado_civil_vit, :sexo_vit, :condicao_vit, :ferimentos_vit, :veiculo_vitima, :observacao_vit, DATE_SUB(now(), INTERVAL 3 HOUR))";
            $inserir = $conn->prepare($query);
            $inserir->bindParam(':fk_boat', $vitima['fk_boat'], PDO::PARAM_STR);
            $inserir->bindParam(':unidade_vit', $vitima['unidade_vit'], PDO::PARAM_STR);
            $nome = strtoupper($vitima['nome_vit']);
            $inserir->bindParam(':nome_vit', $nome, PDO::PARAM_STR);
            $endereco = strtoupper($vitima['endereco_vit']);
            $inserir->bindParam(':endereco_vit', $endereco, PDO::PARAM_STR);
            $bairro = strtoupper($vitima['bairro_vit']);
            $inserir->bindParam(':bairro_vit', $bairro, PDO::PARAM_STR);
            $cidade = strtoupper($vitima['cidade_vit']);
            $inserir->bindParam(':cidade_vit', $cidade, PDO::PARAM_STR);
            if ($vitima['estado_vit'] == '') {
                $inserir->bindParam(':estado_vit', $vazio, PDO::PARAM_STR);
            }else {
                $estado = strtoupper($vitima['estado_vit']);
                $inserir->bindParam(':estado_vit', $estado, PDO::PARAM_STR);
            } 
            $nacionalidade = strtoupper($vitima['nacionalidade_vit']);
            $inserir->bindParam(':nacionalidade_vit', $nacionalidade, PDO::PARAM_STR);
            $inserir->bindParam(':telefone_vit', $vitima['telefone_vit'], PDO::PARAM_STR);
            $inserir->bindParam(':idade_vit', $vitima['idade_vit'], PDO::PARAM_STR);
            if ($vitima['estado_civil_vit'] =='') {
                $inserir->bindParam(':estado_civil_vit', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':estado_civil_vit', $vitima['estado_civil_vit'], PDO::PARAM_STR);
            } 
            if ($vitima['sexo_vit'] =='') {
                $inserir->bindParam(':sexo_vit', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':sexo_vit', $vitima['sexo_vit'], PDO::PARAM_STR);
            }
            if ($vitima['condicao_vit'] =='') {
                $inserir->bindParam(':condicao_vit', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':condicao_vit', $vitima['condicao_vit'], PDO::PARAM_STR);
            }
            if ($vitima['ferimentos_vit'] =='') {
                $inserir->bindParam(':ferimentos_vit', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':ferimentos_vit', $vitima['ferimentos_vit'], PDO::PARAM_STR);
            }
            $inserir->bindParam(':veiculo_vitima', $vitima['veiculo_vitima'], PDO::PARAM_STR);
            $observacao = strtoupper($vitima['observacao_vit']);
            $inserir->bindParam(':observacao_vit', $observacao, PDO::PARAM_STR);
            $inserir->execute();
            if ($inserir->rowCount()) {
                echo "VITÍMA SALVA COM SUCESSO";
            } else {
                echo "VITÍMA NÃO SALVO";
            }
        }else {
            echo "Erro: Primeiramente preencha os dados da aba Boat e salve-os!";
        }

    }else {
        echo "Unidade de vitíma já inserida, corriga a numeração!";
    }
    
}else{
    echo "Sem permissão de acesso!";
}

