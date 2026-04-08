<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {

    $veiculo = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    $vazio = "";
    

    $query_pes_veiculo = "SELECT fk_boat, unidade_vei FROM veiculos WHERE fk_boat=:fk_boat AND unidade_vei=:unidade_vei LIMIT 1";
    $pes_veiculo = $conn->prepare($query_pes_veiculo);
    $pes_veiculo->bindParam(':fk_boat', $veiculo['fk_boat'], PDO::PARAM_STR);
    $pes_veiculo->bindParam(':unidade_vei', $veiculo['unidade_vei'], PDO::PARAM_STR);
    $pes_veiculo->execute();

    if (($pes_veiculo) && ($pes_veiculo->rowCount() == 0)) {
        if (!empty($veiculo['danos_veiculos'])) {
            $img_impacto = base64_decode($veiculo['ponto_impacto_img']);

            $assets = '../anexo/'. date('Y') . '/'.date('m').'/'.$veiculo['fk_boat'].'/';
            if (!is_dir($assets)) {
                mkdir($assets, 0777, true);
            }
            $fp = fopen($assets.'ponto_impacto' .'-V'.$veiculo['unidade_vei'].'.png', 'w+');
            fwrite($fp, $img_impacto);
            $diretorio_impacto = $assets.'ponto_impacto'.'-V'.$veiculo['unidade_vei'].'.png';
        }
        if (!empty($veiculo['fk_boat'])) {
    
            $query = "INSERT INTO veiculos (fk_boat, unidade_vei, placa, marca, modelo, chassi, categoria, renavam, ano, cor_vei, municipio_vei, estado_vei, proprietario_vei, cpf_prop_vei, condutor_vei, endereco_con, bairro_con, cidade_con, estado_con, nacionalidade_con, telefone_con, estado_civil_con, sexo_con, categoria_cnh, numero_registro, cpf_con, idade_con, expedicao_cnh, validade_cnh, estado_cnh, defeito_cnh, obs_cnh, inabilitado, ponto_impacto, ponto_impacto_img, tipo_veiculo, danos_veiculos, relato, created) VALUES (:fk_boat, :unidade_vei, :placa, :marca, :modelo, :chassi, :categoria, :renavam, :ano, :cor_vei, :municipio_vei, :estado_vei, :proprietario_vei, :cpf_prop_vei, :condutor_vei, :endereco_con, :bairro_con, :cidade_con, :estado_con, :nacionalidade_con, :telefone_con, :estado_civil_con, :sexo_con, :categoria_cnh, :numero_registro, :cpf_con, :idade_con, :expedicao_cnh, :validade_cnh, :estado_cnh, :defeito_cnh, :obs_cnh, :inabilitado, :ponto_impacto, :ponto_impacto_img, :tipo_veiculo, :danos_veiculos, :relato, DATE_SUB(now(), INTERVAL 3 HOUR))";
            $inserir = $conn->prepare($query);
            $inserir->bindParam(':fk_boat', $veiculo['fk_boat'], PDO::PARAM_STR);
            $inserir->bindParam(':unidade_vei', $veiculo['unidade_vei'], PDO::PARAM_STR);
            $placa = strtoupper($veiculo['placa']);
            $inserir->bindParam(':placa', $placa, PDO::PARAM_STR);
            $marca = strtoupper($veiculo['marca']);
            $inserir->bindParam(':marca', $marca, PDO::PARAM_STR);
            $modelo = strtoupper($veiculo['modelo']);
            $inserir->bindParam(':modelo', $modelo, PDO::PARAM_STR);
            $chassi = strtoupper($veiculo['chassi']);
            $inserir->bindParam(':chassi', $chassi, PDO::PARAM_STR);
            if ($veiculo['categoria'] =='') {
                $inserir->bindParam(':categoria', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':categoria', $veiculo['categoria'], PDO::PARAM_STR);
            }
            $inserir->bindParam(':renavam', $veiculo['renavam'], PDO::PARAM_STR);
            $inserir->bindParam(':ano', $veiculo['ano'], PDO::PARAM_STR);
            $cor = strtoupper($veiculo['cor_vei']);
            $inserir->bindParam(':cor_vei', $cor, PDO::PARAM_STR);
            $municipio_vei = strtoupper($veiculo['municipio_vei']);
            $inserir->bindParam(':municipio_vei', $municipio_vei, PDO::PARAM_STR);
            if ($veiculo['estado_vei'] =='') {
                $inserir->bindParam(':estado_vei', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':estado_vei', $veiculo['estado_vei'], PDO::PARAM_STR);
            }
            $proprietario_vei = strtoupper($veiculo['proprietario_vei']);
            $inserir->bindParam(':proprietario_vei', $proprietario_vei, PDO::PARAM_STR);
            $inserir->bindParam(':cpf_prop_vei', $veiculo['cpf_prop_vei'], PDO::PARAM_STR);
            // $cid_prop_vei = strtoupper($veiculo['cidade_prop_vei']);
            // $inserir->bindParam(':cidade_prop_vei', $cid_prop_vei, PDO::PARAM_STR);
            // if ($veiculo['estado_prop_vei'] =='Selecione') {
            //     $inserir->bindParam(':estado_prop_vei', $vazio, PDO::PARAM_STR);
            // }else {
            //     $inserir->bindParam(':estado_prop_vei', $veiculo['estado_prop_vei'], PDO::PARAM_STR);
            // }
            $condutor_vei = strtoupper($veiculo['condutor_vei']);
            $inserir->bindParam(':condutor_vei', $condutor_vei, PDO::PARAM_STR);
            $endereco_con = strtoupper($veiculo['endereco_con']);
            $inserir->bindParam(':endereco_con', $endereco_con, PDO::PARAM_STR);
            $bairro_con = strtoupper($veiculo['bairro_con']);
            $inserir->bindParam(':bairro_con', $bairro_con, PDO::PARAM_STR);
            $cidade_con = strtoupper($veiculo['cidade_con']);
            $inserir->bindParam(':cidade_con', $cidade_con, PDO::PARAM_STR);
            if ($veiculo['estado_con'] =='') {
                $inserir->bindParam(':estado_con', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':estado_con', $veiculo['estado_con'], PDO::PARAM_STR);
            }
            $nacionalidade_con = strtoupper($veiculo['nacionalidade_con']);
            $inserir->bindParam(':nacionalidade_con', $nacionalidade_con, PDO::PARAM_STR);
            $inserir->bindParam(':telefone_con', $veiculo['telefone_con'], PDO::PARAM_STR);
            if ($veiculo['estado_civil_con'] =='') {
                $inserir->bindParam(':estado_civil_con', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':estado_civil_con', $veiculo['estado_civil_con'], PDO::PARAM_STR);
            }
            if ($veiculo['sexo_con'] =='') {
                $inserir->bindParam(':sexo_con', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':sexo_con', $veiculo['sexo_con'], PDO::PARAM_STR);
            }
            if ($veiculo['categoria_cnh'] =='') {
                $inserir->bindParam(':categoria_cnh', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':categoria_cnh', $veiculo['categoria_cnh'], PDO::PARAM_STR);
            }
            $inserir->bindParam(':numero_registro', $veiculo['numero_registro'], PDO::PARAM_STR);
            $inserir->bindParam(':cpf_con', $veiculo['cpf_con'], PDO::PARAM_STR);
            $inserir->bindParam(':idade_con', $veiculo['idade_con'], PDO::PARAM_STR);
            $inserir->bindParam(':expedicao_cnh', $veiculo['expedicao_cnh'], PDO::PARAM_STR);
            $inserir->bindParam(':validade_cnh', $veiculo['validade_cnh'], PDO::PARAM_STR);
            if ($veiculo['estado_cnh'] =='') {
                $inserir->bindParam(':estado_cnh', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':estado_cnh', $veiculo['estado_cnh'], PDO::PARAM_STR);
            } 
            $defeito_cnh = strtoupper($veiculo['defeito_cnh']);
            $inserir->bindParam(':defeito_cnh', $defeito_cnh, PDO::PARAM_STR);
            $obs_cnh = strtoupper($veiculo['obs_cnh']);
            $inserir->bindParam(':obs_cnh', $obs_cnh, PDO::PARAM_STR);
            $inserir->bindParam(':inabilitado', $veiculo['inabilitado'], PDO::PARAM_STR);
            $ponto_impacto = strtoupper($veiculo['ponto_impacto']);
            $inserir->bindParam(':ponto_impacto', $ponto_impacto, PDO::PARAM_STR);
            $inserir->bindParam(':ponto_impacto_img', $diretorio_impacto, PDO::PARAM_STR);
            if ($veiculo['tipo_veiculo'] =='') {
                $inserir->bindParam(':tipo_veiculo', $vazio, PDO::PARAM_STR);
            }else {
                $inserir->bindParam(':tipo_veiculo', $veiculo['tipo_veiculo'], PDO::PARAM_STR);
            } 
            $danos_veiculos = strtoupper($veiculo['danos_veiculos']);
            $inserir->bindParam(':danos_veiculos', $danos_veiculos, PDO::PARAM_STR);
            $relato = strtoupper($veiculo['relato']);
            $inserir->bindParam(':relato', $relato, PDO::PARAM_STR);
            $inserir->execute();
            if ($inserir->rowCount() > 0 ) {
                echo "VEICULO SALVO COM SUCESSO!";
            } else {
                echo "VEICULO NÃO SALVO!";
            }
        }else {
           echo "Erro: Primeiramente preencha os dados da aba Boat e salve-os!";
        }
    }else {
        echo "Unidade de trafego já inserida, corriga a numeração!";
    }
}else {
    echo "Sem permissão de acesso!";
}


