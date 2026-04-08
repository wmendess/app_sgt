<?php
include_once 'conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {
    
    $relatorio = filter_input_array(INPUT_POST, FILTER_DEFAULT);

    $query_pes_relatorio = "SELECT fk_boat FROM relatorios WHERE fk_boat=:fk_boat LIMIT 1";
    $pes_relatorio = $conn->prepare($query_pes_relatorio);
    $pes_relatorio->bindParam(':fk_boat', $relatorio['fk_boat'], PDO::PARAM_STR);
    $pes_relatorio->execute();

    if (!empty($relatorio['fk_boat'])) {

        if (($pes_relatorio) && ($pes_relatorio->rowCount() == 0)) {
            $query_relatorio = "INSERT INTO relatorios (fk_boat, fatos_rel, created) VALUES (:fk_boat, :fatos_rel, DATE_SUB(now(), INTERVAL 3 HOUR))";
            $result_relatorio = $conn->prepare($query_relatorio);
            $result_relatorio->bindParam(':fk_boat', $relatorio['fk_boat'], PDO::PARAM_STR);
            $fatos_rel = strtoupper($relatorio['fatos_rel']);
            $result_relatorio->bindParam(':fatos_rel', $fatos_rel, PDO::PARAM_STR);
            $result_relatorio->execute();
            if ($result_relatorio->rowCount()) {
                echo "RELATÓRIO SALVO COM SUCESSO";
            } else {
                echo "RELATÓRIO NÃO SALVO";
            }
    
        }else {
            $query_relatorio_edit = "UPDATE relatorios SET fatos_rel=:fatos_rel, modified=DATE_SUB(now(), INTERVAL 3 HOUR) WHERE fk_boat=:fk_boat";
            $result_relatorio_edit = $conn->prepare($query_relatorio_edit);
            $result_relatorio_edit->bindParam(':fk_boat', $relatorio['fk_boat'], PDO::PARAM_STR);
            $fatos_rel =strtoupper($relatorio['fatos_rel']);
            $result_relatorio_edit->bindParam(':fatos_rel', $fatos_rel, PDO::PARAM_STR);
            $result_relatorio_edit->execute();
            if ($result_relatorio_edit->rowCount() > 0) {
                echo "RELATÓRIO EDITADO COM SUCESSO!";
            }else {
                echo "RELATÓRIO NÃO EDITADO!";
            }
        }
    }else {
        echo "Erro: Primeiramente preencha os dados da aba Boat e salve-os!";
    }

    
    
}else {
    echo "Sem permissão de acesso!";
}
