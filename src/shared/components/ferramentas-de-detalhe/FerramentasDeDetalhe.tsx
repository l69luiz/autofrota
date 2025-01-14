import React from "react";
import { Box, Button, Divider, Icon, Paper, useTheme } from "@mui/material";

interface IFerramentasDeDetalheProps{
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    mostrarBotaoVoltar?: boolean;
    mostrarBotaoApagar?: boolean;
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoSalvarEFechar?: boolean;

    aoClicarEmNovo?: () => void;
    aoClicarEmVoltar?: () => void;
    aoClicarEmApagar?: () => void;
    aoClicarEmSalvar?: () => void;
    aoClicarEmSalvarEFechar?: () => void;

};

export const FerramentasDeDetalhe: React.FC<IFerramentasDeDetalheProps> =({
    textoBotaoNovo= 'Novo',
    mostrarBotaoNovo=true,
    mostrarBotaoVoltar=true,
    mostrarBotaoApagar=true,
    mostrarBotaoSalvar=true,
    mostrarBotaoSalvarEFechar=false,

    aoClicarEmNovo,
    aoClicarEmVoltar,
    aoClicarEmApagar,
    aoClicarEmSalvar,
    aoClicarEmSalvarEFechar,


}) => {

const theme = useTheme();
    return(

        <Box
        gap={1}
        marginX={1}
        padding={1}
        paddingX={2}
        display='flex'
        alignItems='center'
        height={theme.spacing(5)}
        component={Paper}>

                {mostrarBotaoSalvar&&(<Button
                variant='contained'
                disableElevation
                color='primary'
                onClick={aoClicarEmSalvar}
                startIcon={<Icon>save</Icon>}
                >Salvar</Button>)}
                
                {mostrarBotaoSalvarEFechar&&(<Button
                variant='outlined'
                disableElevation
                color='primary'
                onClick={aoClicarEmSalvarEFechar}
                startIcon={<Icon>save</Icon>}
                >Salvar e voltar</Button>)}
                
                {mostrarBotaoApagar&&(<Button
                variant='outlined'
                disableElevation
                color='primary'
                onClick={aoClicarEmApagar}
                startIcon={<Icon>delete</Icon>}
                >Apagar</Button>)}
                
                {mostrarBotaoNovo&&(<Button
                variant='outlined'
                disableElevation
                color='primary'
                onClick={aoClicarEmNovo}
                startIcon={<Icon>add</Icon>}
                >{textoBotaoNovo}</Button>)}

                <Divider variant='middle' orientation='vertical' />
                
                {mostrarBotaoVoltar&&(<Button
                variant='outlined'
                disableElevation
                color='primary'
                onClick={aoClicarEmVoltar}
                startIcon={<Icon>arrow_back</Icon>}
                >Voltar</Button>)}
        </Box>

    );
  
};