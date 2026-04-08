<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

    $update_veiculo = filter_input_array(INPUT_POST, FILTER_DEFAULT);

    if (isset($update_veiculo['ass'])) {
        
        if (!empty($update_veiculo['cpf_con']) && !empty($update_veiculo['danos_veiculos'])) {
            $assinatura = base64_decode($update_veiculo['assinatura']);
            $assets = '../arquivos/assinatura_cond/' . date('Y') . '/'.date('m').'/' ;
            if (!is_dir($assets)) {
                mkdir($assets, 0777, true);
            }
            $fp = fopen($assets . $update_veiculo['fk_boat'] . '-' . $update_veiculo['cpf_con'] . '.png', 'w+');
            fwrite($fp, $assinatura);
            $diretorio = $assets . $update_veiculo['fk_boat'] . '-' . $update_veiculo['cpf_con'] . '.png';
        }
        $query_ass = "UPDATE veiculos SET assinatura=:assinatura, acordante=:acordante, caminho_assinatura=:caminho_assinatura, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE id_veiculo=:id_veiculo";
        $inserir_ass = $conn->prepare($query_ass);
        $inserir_ass->bindParam(':id_veiculo', $update_veiculo['id_veiculo'], PDO::PARAM_INT);
        $inserir_ass->bindParam(':assinatura', $update_veiculo['assinatura'], PDO::PARAM_STR);
        $inserir_ass->bindParam(':acordante', $update_veiculo['acordante'], PDO::PARAM_STR);
        $inserir_ass->bindParam(':caminho_assinatura', $diretorio, PDO::PARAM_STR);
        $inserir_ass->execute();

        if ($inserir_ass->rowCount() > 0) {
            echo "ASSINATURA SALVA COM SUCESSO!";
        } else {
            echo "ASSINATURA NÃO SALVA!";
        }
        
    }else {
        
        $vazio = "";

        if (!empty($update_veiculo['danos_veiculos'])) {
            $img_impacto = base64_decode($update_veiculo['ponto_impacto_img']);
            mkdir('../anexo/'. date('Y') . '/'.date('m').'/'.$update_veiculo['fk_boat'].'/', 0777, true);
            $fp = fopen('../anexo/' . date('Y').'/'.date('m').'/'.$update_veiculo['fk_boat'].'/'.'ponto_impacto'.'-V'.$update_veiculo['unidade_vei'].'.png', 'w+');
            fwrite($fp, $img_impacto);
            $diretorio_impacto = '../anexo/' . date('Y') . '/'.date('m').'/'.$update_veiculo['fk_boat'].'/'.'ponto_impacto'.'-V'.$update_veiculo['unidade_vei'].'.png';
        }
    
        $query = "UPDATE veiculos SET unidade_vei=:unidade_vei, fk_boat=:fk_boat, placa=:placa, marca=:marca, modelo=:modelo, chassi=:chassi, categoria=:categoria, renavam=:renavam, ano=:ano, cor_vei=:cor_vei, municipio_vei=:municipio_vei, estado_vei=:estado_vei, proprietario_vei=:proprietario_vei, cpf_prop_vei=:cpf_prop_vei, condutor_vei=:condutor_vei, endereco_con=:endereco_con, bairro_con=:bairro_con, cidade_con=:cidade_con, estado_con=:estado_con, nacionalidade_con=:nacionalidade_con, telefone_con=:telefone_con, estado_civil_con=:estado_civil_con, sexo_con=:sexo_con, categoria_cnh=:categoria_cnh, numero_registro=:numero_registro, cpf_con=:cpf_con, idade_con=:idade_con, expedicao_cnh=:expedicao_cnh, validade_cnh=:validade_cnh, estado_cnh=:estado_cnh, defeito_cnh=:defeito_cnh, obs_cnh=:obs_cnh, inabilitado=:inabilitado, ponto_impacto=:ponto_impacto, ponto_impacto_img=:ponto_impacto_img, tipo_veiculo=:tipo_veiculo, danos_veiculos=:danos_veiculos, relato=:relato, modified=now() WHERE id_veiculo=:id_veiculo";
        $inserir = $conn->prepare($query);
        $inserir->bindParam(':id_veiculo', $update_veiculo['id_veiculo'], PDO::PARAM_INT);
        $inserir->bindParam(':unidade_vei', $update_veiculo['unidade_vei'], PDO::PARAM_STR);
        $inserir->bindParam(':fk_boat', $update_veiculo['fk_boat'], PDO::PARAM_STR);
        $inserir->bindParam(':placa', $update_veiculo['placa'], PDO::PARAM_STR);
        $inserir->bindParam(':marca', $update_veiculo['marca'], PDO::PARAM_STR);
        $inserir->bindParam(':modelo', $update_veiculo['modelo'], PDO::PARAM_STR);
        $inserir->bindParam(':chassi', $update_veiculo['chassi'], PDO::PARAM_STR);
        if ($update_veiculo['categoria'] =='Selecione') {
            $inserir->bindParam(':categoria', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':categoria', $update_veiculo['categoria'], PDO::PARAM_STR);
        }
        $inserir->bindParam(':renavam', $update_veiculo['renavam'], PDO::PARAM_STR);
        $inserir->bindParam(':ano', $update_veiculo['ano'], PDO::PARAM_STR);
        $inserir->bindParam(':cor_vei', $update_veiculo['cor_vei'], PDO::PARAM_STR);
        $inserir->bindParam(':municipio_vei',$update_veiculo['municipio_vei'], PDO::PARAM_STR);
        if ($update_veiculo['estado_vei'] =='Selecione') {
            $inserir->bindParam(':estado_vei', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':estado_vei', $update_veiculo['estado_vei'], PDO::PARAM_STR);
        }
        
        $inserir->bindParam(':proprietario_vei', $update_veiculo['proprietario_vei'], PDO::PARAM_STR);
        $inserir->bindParam(':cpf_prop_vei', $update_veiculo['cpf_prop_vei'], PDO::PARAM_STR);
        // $inserir->bindParam(':cidade_prop_vei', $update_veiculo['cidade_prop_vei'], PDO::PARAM_STR);
        // if ($update_veiculo['estado_prop_vei'] =='Selecione') {
        //     $inserir->bindParam(':estado_prop_vei', $vazio, PDO::PARAM_STR);
        // }else {
        //     $inserir->bindParam(':estado_prop_vei', $update_veiculo['estado_prop_vei'], PDO::PARAM_STR);
        // }     
        $inserir->bindParam(':condutor_vei', $update_veiculo['condutor_vei'], PDO::PARAM_STR);
        $inserir->bindParam(':endereco_con', $update_veiculo['endereco_con'], PDO::PARAM_STR);
        $inserir->bindParam(':bairro_con', $update_veiculo['bairro_con'], PDO::PARAM_STR);
        $inserir->bindParam(':cidade_con', $update_veiculo['cidade_con'], PDO::PARAM_STR);
        if ($update_veiculo['estado_con'] =='Selecione') {
            $inserir->bindParam(':estado_con', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':estado_con', $update_veiculo['estado_con'], PDO::PARAM_STR);
        }
        if (empty($update_veiculo['condutor_vei'])) {
            $inserir->bindParam(':nacionalidade_con', $vazio, PDO::PARAM_STR);
        }else {
            $nacionalidade_con = strtoupper($update_veiculo['nacionalidade_con']);
            $inserir->bindParam(':nacionalidade_con', $nacionalidade_con, PDO::PARAM_STR);
        } 
        $inserir->bindParam(':telefone_con', $update_veiculo['telefone_con'], PDO::PARAM_STR);
        if ($update_veiculo['estado_civil_con'] =='Selecione') {
            $inserir->bindParam(':estado_civil_con', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':estado_civil_con', $update_veiculo['estado_civil_con'], PDO::PARAM_STR);
        }
        if ($update_veiculo['sexo_con'] =='Selecione') {
            $inserir->bindParam(':sexo_con', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':sexo_con', $update_veiculo['sexo_con'], PDO::PARAM_STR);
        }
        if ($update_veiculo['categoria_cnh'] =='Selecione') {
            $inserir->bindParam(':categoria_cnh', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':categoria_cnh', $update_veiculo['categoria_cnh'], PDO::PARAM_STR);
        }
        $inserir->bindParam(':numero_registro', $update_veiculo['numero_registro'], PDO::PARAM_STR);
        $inserir->bindParam(':cpf_con', $update_veiculo['cpf_con'], PDO::PARAM_STR);
        $inserir->bindParam(':idade_con', $update_veiculo['idade_con'], PDO::PARAM_STR);
        $inserir->bindParam(':expedicao_cnh', $update_veiculo['expedicao_cnh'], PDO::PARAM_STR);
        $inserir->bindParam(':validade_cnh', $update_veiculo['validade_cnh'], PDO::PARAM_STR);
        if ($update_veiculo['estado_cnh'] =='Selecione') {
            $inserir->bindParam(':estado_cnh', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':estado_cnh', $update_veiculo['estado_cnh'], PDO::PARAM_STR);
        } 
        $inserir->bindParam(':defeito_cnh', $update_veiculo['defeito_cnh'], PDO::PARAM_STR);
        $inserir->bindParam(':obs_cnh', $update_veiculo['obs_cnh'], PDO::PARAM_STR);
        $inserir->bindParam(':inabilitado', $update_veiculo['inabilitado'], PDO::PARAM_STR);
        $inserir->bindParam(':ponto_impacto', $update_veiculo['ponto_impacto'], PDO::PARAM_STR);
        $inserir->bindParam(':ponto_impacto_img', $diretorio_impacto, PDO::PARAM_STR);
        if ($update_veiculo['tipo_veiculo'] =='Selecione') {
            $inserir->bindParam(':tipo_veiculo', $vazio, PDO::PARAM_STR);
        }else {
            $inserir->bindParam(':tipo_veiculo', $update_veiculo['tipo_veiculo'], PDO::PARAM_STR);
        } 
        
        $inserir->bindParam(':danos_veiculos', $update_veiculo['danos_veiculos'], PDO::PARAM_STR);
        $inserir->bindParam(':relato', $update_veiculo['relato'], PDO::PARAM_STR);
        $inserir->execute();
    
        if ($inserir->rowCount() > 0 ) {
            echo "VEICULO EDITADO COM SUCESSO!";
        } else {
            echo "VEICULO NÃO EDITADO!";;
        }
    }
    
}else {
    echo "Sem permissão de acesso!";
}