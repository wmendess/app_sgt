<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

    $update_vitima = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    $vazio = "";

    $query = "UPDATE vitimas SET unidade_vit=:unidade_vit, nome_vit=:nome_vit, endereco_vit=:endereco_vit, bairro_vit=:bairro_vit, cidade_vit=:cidade_vit, estado_vit=:estado_vit, nacionalidade_vit=:nacionalidade_vit, telefone_vit=:telefone_vit, idade_vit=:idade_vit, estado_civil_vit=:estado_civil_vit, sexo_vit=:sexo_vit, condicao_vit=:condicao_vit, ferimentos_vit=:ferimentos_vit, veiculo_vitima=:veiculo_vitima, observacao_vit=:observacao_vit, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE id_vitima=:id_vitima";
    $inserir = $conn->prepare($query);
    $inserir->bindParam(':id_vitima', $update_vitima['id_vitima'], PDO::PARAM_STR);
    $inserir->bindParam(':unidade_vit', $update_vitima['unidade_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':nome_vit', $update_vitima['nome_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':endereco_vit', $update_vitima['endereco_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':bairro_vit', $update_vitima['bairro_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':cidade_vit', $update_vitima['cidade_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':estado_vit', $update_vitima['estado_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':nacionalidade_vit', $update_vitima['nacionalidade_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':telefone_vit', $update_vitima['telefone_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':idade_vit', $update_vitima['idade_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':estado_civil_vit', $update_vitima['estado_civil_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':sexo_vit', $update_vitima['sexo_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':condicao_vit', $update_vitima['condicao_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':ferimentos_vit', $update_vitima['ferimentos_vit'], PDO::PARAM_STR);
    $inserir->bindParam(':veiculo_vitima', $update_vitima['veiculo_vitima'], PDO::PARAM_STR);
    $inserir->bindParam(':observacao_vit', $update_vitima['observacao_vit'], PDO::PARAM_STR);
   
    $inserir->execute();

    if ($inserir->rowCount()) {
        echo "VITÍMA EDITADO COM SUCESSO";
    } else {
        echo "VITÍMA NÃO EDITADO";;
    }
}else {
    echo "Sem permissão de acesso!";
}

