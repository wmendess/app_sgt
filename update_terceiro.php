<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {
    $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

    if (isset($dados['ass'])) {
        
        if (!empty($dados['cpf_con'])) {
            $assinatura = base64_decode($dados['assinatura']);
            mkdir('../arquivos/assinatura_cond/' . date('Y') . '/'.date('m').'/', 0777, true);
            $fp = fopen('../arquivos/assinatura_cond/' . date('Y') . '/'.date('m').'/' . $dados['fk_boat'] . '-' . $dados['cpf_con'] . '.png', 'w+');
            fwrite($fp, $assinatura);
            $diretorio = '../arquivos/assinatura_cond/' . date('Y') . '/'.date('m').'/' . $dados['fk_boat'] . '-' . $dados['cpf_con'] . '.png';
        }
        $query_ass = "UPDATE veiculos SET assinatura=:assinatura, caminho_assinatura=:caminho_assinatura, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE id_veiculo=:id_veiculo";
        $inserir_ass = $conn->prepare($query_ass);
        $inserir_ass->bindParam(':id_veiculo', $dados['id_veiculo'], PDO::PARAM_INT);
        $inserir_ass->bindParam(':assinatura', $dados['assinatura'], PDO::PARAM_STR);
        $inserir_ass->bindParam(':caminho_assinatura', $diretorio, PDO::PARAM_STR);
        $inserir_ass->execute();

        if ($inserir_ass->rowCount() > 0) {
            echo "ASSINATURA SALVA COM SUCESSO!";
        } else {
            echo "ASSINATURA NÃO SALVA!";
        }
        
    }else {
    
        $query = "UPDATE veiculos SET  condutor_vei=:condutor_vei, endereco_con=:endereco_con, bairro_con=:bairro_con, cidade_con=:cidade_con, estado_con=:estado_con, nacionalidade_con=:nacionalidade_con, telefone_con=:telefone_con, estado_civil_con=:estado_civil_con, sexo_con=:sexo_con, numero_registro=:numero_registro, cpf_con=:cpf_con, modified=now() WHERE id_veiculo=:id_veiculo";
        $inserir = $conn->prepare($query);
        $inserir->bindParam(':id_veiculo', $dados['id_veiculo'], PDO::PARAM_INT);
        $terceiro = strtoupper($dados['condutor_vei']);
        $inserir->bindParam(':condutor_vei', $terceiro, PDO::PARAM_STR);
        $endereco = strtoupper($dados['endereco_con']);
        $inserir->bindParam(':endereco_con', $endereco, PDO::PARAM_STR);
        $inserir->bindParam(':bairro_con', $dados['bairro_con'], PDO::PARAM_STR);
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
        $inserir->execute();
        if ($inserir->rowCount() > 0 ) {
            echo "TERCEIRO EDITADO COM SUCESSO!";
        } else {
            echo "TERCEIRO NÃO EDITADO!";;
        }
    }
    
}else {
    echo "Sem permissão de acesso!";
}