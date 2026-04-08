<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {
    
    $acordo = filter_input_array(INPUT_POST, FILTER_DEFAULT);

    $query_pes_acordo = "SELECT fk_boat FROM acordos WHERE fk_boat=:fk_boat LIMIT 1";
    $pes_acordo = $conn->prepare($query_pes_acordo);
    $pes_acordo->bindParam(':fk_boat', $acordo['fk_boat'], PDO::PARAM_STR);
    $pes_acordo->execute();

    if (!empty($acordo['fk_boat'])) {
        if (($pes_acordo) && ($pes_acordo->rowCount() == 0)) {
            $query_acordo = "INSERT INTO acordos (fk_boat, testemunha_1, cpf_1, testemunha_2, cpf_2, descricao_acordo, created) VALUES (:fk_boat, :testemunha_1, :cpf_1, :testemunha_2, :cpf_2, :descricao_acordo, DATE_SUB(now(), INTERVAL 3 HOUR))";
            $result_acordo = $conn->prepare($query_acordo);
            $result_acordo->bindParam(':fk_boat', $acordo['fk_boat'], PDO::PARAM_STR);
            $testemunha_1 = strtoupper($acordo['testemunha_1']);
            $result_acordo->bindParam(':testemunha_1', $testemunha_1, PDO::PARAM_STR);
            $result_acordo->bindParam(':cpf_1', $acordo['cpf_1'], PDO::PARAM_STR);
            $testemunha_2 = strtoupper($acordo['testemunha_2']);
            $result_acordo->bindParam(':testemunha_2', $testemunha_2, PDO::PARAM_STR);
            $result_acordo->bindParam(':cpf_2', $acordo['cpf_2'], PDO::PARAM_STR);
            $descricao_acordo = strtoupper($acordo['descricao_acordo']);
            $result_acordo->bindParam(':descricao_acordo', $descricao_acordo, PDO::PARAM_STR);
            $result_acordo->execute();
            if ($result_acordo->rowCount()) {
                echo "ACORDO SALVO COM SUCESSO!";
            } else {
                echo "ACORDO NÃO SALVO!";
            }
        }else{
            $query_acordo_edit = "UPDATE acordos SET descricao_acordo=:descricao_acordo, testemunha_1=:testemunha_1, cpf_1=:cpf_1, testemunha_2=:testemunha_2, cpf_2=:cpf_2, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE fk_boat=:fk_boat";
            $result_acordo_edit = $conn->prepare($query_acordo_edit);
            $result_acordo_edit->bindParam(':fk_boat', $acordo['fk_boat'], PDO::PARAM_STR);
            $descricao_acordo = strtoupper($acordo['descricao_acordo']);
            $result_acordo_edit->bindParam(':descricao_acordo', $descricao_acordo, PDO::PARAM_STR);
            $testemunha_1 = strtoupper($acordo['testemunha_1']);
            $result_acordo_edit->bindParam(':testemunha_1', $testemunha_1, PDO::PARAM_STR);
            $result_acordo_edit->bindParam(':cpf_1', $acordo['cpf_1'], PDO::PARAM_STR);
            $testemunha_2 = strtoupper($acordo['testemunha_2']);
            $result_acordo_edit->bindParam(':testemunha_2', $testemunha_2, PDO::PARAM_STR);
            $result_acordo_edit->bindParam(':cpf_2', $acordo['cpf_2'], PDO::PARAM_STR);
            $result_acordo_edit->execute();
            if ($result_acordo_edit->rowCount() > 0) {
                echo "ACORDO EDITADO COM SUCESSO!";    
            }else {
                echo "ACORDO NÃO EDITADO!";
            }            
        }
    }else {
        echo "Erro: Primeiramente preencha os dados da aba Boat e salve-os!";
    }

   
}else {
    echo "Sem permissão de acesso!";
}
