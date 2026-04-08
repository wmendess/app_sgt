<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

    $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        if (!empty($dados['fk_boat'])) {
    
            $query = "INSERT INTO veiculos (fk_boat, condutor_vei, endereco_con, bairro_con, cidade_con, estado_con, nacionalidade_con, telefone_con, estado_civil_con, sexo_con, numero_registro, cpf_con, acordante, created) VALUES (:fk_boat, :condutor_vei, :endereco_con, :bairro_con, :cidade_con, :estado_con, :nacionalidade_con, :telefone_con, :estado_civil_con, :sexo_con, :numero_registro, :cpf_con, :acordante, DATE_SUB(now(), INTERVAL 3 HOUR))";
            $inserir = $conn->prepare($query);
            $inserir->bindParam(':fk_boat', $dados['fk_boat'], PDO::PARAM_STR);
            $terceiro = strtoupper($dados['condutor_vei']);
            $inserir->bindParam(':condutor_vei', $terceiro, PDO::PARAM_STR);
            $endereco = strtoupper($dados['endereco_con']);
            $inserir->bindParam(':endereco_con', $endereco, PDO::PARAM_STR);
            $bairro = strtoupper($dados['bairro_con']);
            $inserir->bindParam(':bairro_con', $bairro, PDO::PARAM_STR);
            $cidade = strtoupper($dados['cidade_con']);
            $inserir->bindParam(':cidade_con', $cidade, PDO::PARAM_STR);
            $inserir->bindParam(':estado_con', $dados['estado_con'], PDO::PARAM_STR);
            $nacionalidade = strtoupper($dados['nacionalidade_con']);
            $inserir->bindParam(':nacionalidade_con', $nacionalidade, PDO::PARAM_STR);
            $inserir->bindParam(':telefone_con', $dados['telefone_con'], PDO::PARAM_STR);
            $inserir->bindParam(':estado_civil_con', $dados['estado_civil_con'], PDO::PARAM_STR);
            $inserir->bindParam(':sexo_con', $dados['sexo_con'], PDO::PARAM_STR);
            $inserir->bindParam(':numero_registro', $dados['numero_registro'], PDO::PARAM_STR);
            $inserir->bindParam(':cpf_con', $dados['cpf_con'], PDO::PARAM_STR);
            $inserir->bindParam(':acordante', $dados['acordante'], PDO::PARAM_STR);
            $inserir->execute();
            if ($inserir->rowCount() > 0 ) {
                echo "TERCEIRO SALVO COM SUCESSO!";
            } else {
                echo "TERCEIRO NÃO SALVO!";
            }
        }else {
           echo "Erro: Primeiramente preencha os dados da aba Boat e salve-os!";
        }  
    
}else {
    echo "Sem permissão de acesso!";
}


