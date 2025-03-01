// export const generateTemplateNewProduct = (productName: string, filialName: string) => {
//     return `
//       <!DOCTYPE html>
//           <html>
//           <head>
//               <style>
//                   .container {
//                       font-family: Arial, sans-serif;
//                       background-color: #f4f4f4;
//                       padding: 20px;
//                       border-radius: 10px;
//                       max-width: 600px;
//                       margin: auto;
//                   }
//                   .header {
//                       background-color: #4CAF50;
//                       color: white;
//                       padding: 10px;
//                       text-align: center;
//                       border-radius: 10px 10px 0 0;
//                   }
//                   .content {
//                       padding: 20px;
//                       background-color: white;
//                       border-radius: 0 0 10px 10px;
//                   }
//                   .footer {
//                       text-align: center;
//                       padding: 10px;
//                       font-size: 12px;
//                       color: #888;
//                   }
//               </style>
//           </head>
//           <body>
//               <div class="container">
//                   <div class="header">
//                       <h1>Produto Enviado</h1>
//                   </div>
//                   <div class="content">
//                       <p>Olá, ${filialName}</p>
//                       <p>Estamos felizes em informar que o seu produto ${productName} foi enviado com sucesso!</p>
//                       <p>Obrigado por comprar conosco.</p>
//                   </div>
//                   <div class="footer">
//                       <p>&copy; 2023 Sua Empresa. Todos os direitos reservados.</p>
//                   </div>
//               </div>
//           </body>
//           </html>
//                `
// }


export const generateTemplateProductStatus = (
    productName: string,
    filialName: string,
    status: "saindo" | "chegou"
) => {
    const title = status === "saindo" ? "Produto a Caminho" : "Produto Entregue";
    const headerColor = status === "saindo" ? "#FFA500" : "#008CBA"; // Laranja para "saindo", azul para "chegou"
    const message =
        status === "saindo"
            ? `Estamos felizes em informar que o seu produto <strong>${productName}</strong> foi enviado com sucesso e está a caminho da filial destino!`
            : `O seu produto <strong>${productName}</strong> chegou ao destino com sucesso!`;

    return `<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 10px;
            max-width: 600px;
            margin: auto;
        }
        .header {
            background-color: ${headerColor};
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
            background-color: white;
            border-radius: 0 0 10px 10px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            <p>Olá, ${filialName}</p>
            <p>${message}</p>
            <p>Obrigado por comprar conosco.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Sua Empresa. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>`;
}
