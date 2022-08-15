import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { signInEndpoint, IUser } from "./backend";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    error: {
        background: "rgb(253, 236, 234)",
        borderRadius: "4px",
        padding: "16px",
        margin: "16px 0",
        color: "red"
    }
})

interface ILoginScreenProps {
    onSignIn: (user: IUser) => void;
}

export function LoginScreen(props: ILoginScreenProps){
    const classes = useStyles();

    const [email, setEmail] = useState<string>("danilo@email.com");
    const [password, setPassword] = useState<string>("1234");
    const [error, setError] = useState<string>("")

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    }

    const signIn = (e: React.FormEvent): void => {   
        e.preventDefault();
            signInEndpoint(email, password).then((user) => props.onSignIn(user),
         (error) => {
            setError("E-mail não encontrado ou senha incorreta")
        })
    }

    return (
        <Container maxWidth="sm">
            <h1>Agenda React</h1>
            <p>
                Digite e-mail e senha para entrar no sistema. Para testar, use o e-mail
                <kbd>danilo@email.com</kbd> e a senha <kbd>1234</kbd>.
            </p>
            <form onSubmit={signIn}>
                <TextField
                    margin="normal"
                    label="E-mail"
                    fullWidth
                    value={email}
                    onChange={handleChangeEmail}
                />
                <TextField
                    margin="normal"
                    label="E-mail"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                />
                {error && (
                    <div className={classes.error}>{error}</div>
                )}
                <div>
                    <Button variant="contained" color="primary" type="submit" fullWidth>Entrar</Button>
                </div>
            </form>
        </Container>
    )
}