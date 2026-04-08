<?php
include_once '../config/conexao.php';

$SQLKEY = "w.mendessmtt63761";
// Versao Anterior 1
if ($_POST['key'] == $SQLKEY) {
    $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

    if ((!empty($dados['cpf'])) and (!empty($dados['password']))) {

        if ($dados['versao'] == '2') {
            $query_usuario = "SELECT u.id_user, u.cpf, u.usuario, u.matricula, u.fk_setor, u.fk_equipe, u.fk_funcao, u.fk_categoria, u.password, u.fk_status, u.anexo, s.setor, r.rule FROM adm_users AS u INNER JOIN adm_rules AS r ON u.id_user=r.fk_user LEFT JOIN adm_setores AS s ON u.fk_setor=s.id_setor WHERE u.cpf = :cpf LIMIT 1";
            $result_usuario = $conn->prepare($query_usuario);
            $result_usuario->bindParam(':cpf', $dados['cpf'], PDO::PARAM_STR);
            $result_usuario->execute();

            if (($result_usuario) and ($result_usuario->rowCount() != 0)) {
                $row_usuario = $result_usuario->fetch(PDO::FETCH_ASSOC);
                $dados['password'] = sha1($dados['password']);
                if ($row_usuario['password'] == $dados['password']) {
                    if ($row_usuario['fk_status'] == 1) {
                    $dados_login = [
                        "id_user" => $row_usuario['id_user'],
                        "cpf" => $row_usuario['cpf'],
                        "usuario" => $row_usuario['usuario'],
                        "matricula" => $row_usuario['matricula'],
                        "fk_setor" => $row_usuario['fk_setor'],
                        "fk_equipe" => $row_usuario['fk_equipe'],
                        "fk_funcao" => $row_usuario['fk_funcao'],
                        "fk_categoria" => $row_usuario['fk_categoria'],
                        "setor" => $row_usuario['setor'],
                        "password" => $row_usuario['password'],
                        "anexo" => $row_usuario['anexo'],
                        "rule" => $row_usuario['rule']
                    ];
                    echo json_encode($dados_login);
                    } else {
                        // Usuário não autorizado, entre em contato com a coordenação!
                        echo 3;
                    }
                } else {
                    //  Senha inválida
                    echo 1;
                }
            } else {
                //  Cpf inválido
                echo 2;
            }
            
        }else {
             //  Atualize a versão do aplicativo!
            echo 6;
        }
        
    } else {
        // Preencha todos os campos!
        echo 4;
    }
}else {
    //  Sem permissão de acesso!
    echo 5;
}
