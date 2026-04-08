<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '../vendor/autoload.php';
include_once '../config/conexao.php';

$SQLKEY = "w.mendessmtt63761";

if ($_POST['key'] == $SQLKEY) {
    $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    
    if (isset($dados['reset_password'])) {
        if (!empty($dados['pass_new']) && !empty($dados['pass_conf'])) {
            $dados['pass_new'] = sha1($dados['pass_new']);
            $dados['pass_conf'] = sha1($dados['pass_conf']);

            if ($dados['pass_new'] == $dados['pass_conf']) {
                $sql_update = "UPDATE adm_users SET password=:new_senha, modified=now() WHERE id_user=:id_user";
                $update_senha = $conn->prepare($sql_update);
                $update_senha->bindParam(':new_senha', $dados['pass_new'], PDO::PARAM_STR);
                $update_senha->bindParam(':id_user', $dados['id_user'], PDO::PARAM_STR);
                $update_senha->execute();
                echo "Senha trocada com sucesso!";
            } else {
                echo "Senhas divergentes!";
            }
           
        } else {
            echo "Preencha todos os campos!";
        }
    }elseif (isset($dados['recover_password'])) {

        $smtm = "SELECT id_user, email FROM adm_users WHERE cpf=:cpf";
        $result = $conn->prepare($smtm);
        $result->bindParam(':cpf', $dados['cpf'], PDO::PARAM_STR);
        $result->execute();
        if ($result->rowCount()) {

            $row = $result->fetch(PDO::FETCH_ASSOC);
            if (!empty($row['email'])) {

                $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuywxyz';
                $charactersLength = strlen($characters);
                $senha = '';
                for ($i = 0; $i < 6; $i++) {
                    $senha .= $characters[rand(0, $charactersLength - 1)];
                }
                
                $tokenSenha = sha1($senha);
                $query_senha = "UPDATE adm_users SET password=:password WHERE id_user=:id_user";
                $result_senha = $conn->prepare($query_senha);
                $result_senha->bindParam(':id_user', $row['id_user'], PDO::PARAM_INT);
                $result_senha->bindParam(':password', $tokenSenha, PDO::PARAM_STR);
                $result_senha->execute();
                if (!$result_senha->rowCount()) {
                    echo "Erro ao encaminhar o email, tente novamente!";
                } else {
                    $output ='<p>Sua senha temporaria segue abaixo, após o login efetuar a troca da senha!</p>';
                    $output .='<button style="background-color: green; color: black; padding: 15px 32px; text-align: center; border: 2px solid black; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px;">'.$senha.'</button>';
                    $body = $output;
                    $subject = "Recuperação de senha";
        
                    $mail = new PHPMailer(true);
        
                    try {
                        //Server settings
                        $mail->CharSet = 'UTF-8';                 
                        $mail->isSMTP();                                            
                        $mail->Host       = 'smtp.hostinger.com';                     
                        $mail->SMTPAuth   = true;                                   
                        $mail->Username   = 'suporte@smttgtt.com.br';                     
                        $mail->Password   = 'Well@8520';                               
                        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            
                        $mail->Port       = 465;                                    
                    
                        //Recipients
                        $mail->setFrom('suporte@smttgtt.com.br', 'Sistema Geral de Trânsito - SGT');
                        $mail->addAddress($row['email']);
                    
                        //Content
                        $mail->isHTML(true);                                 
                        $mail->Subject = $subject;
                        $mail->Body    = $body;
                        $mail->AltBody = 'Sua solicitação foi atendida com Sucesso!';
                    
                        $mail->send();
                        echo 'Foi encaminhado o email para: '.$row['email'].', por favor verifique sua caixa de entrada ou no span de seu email';
                    } catch (Exception $e) {
                        echo "Messagem não enviada, tente novamente!";
                    }
                }          
            }else {
                echo "Email não encontrado no sistema, entre em contato com Admistrador para cadastrar o email!";
            }
        
        } else {
            echo "Usuário não encontrado!";
        }
    }
        
}else {
    echo "Sem permissão de acesso!";
}
