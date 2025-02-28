export const generateTemplateNewProduct = (productName: string) => {
    return `
      <!DOCTYPE html>
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
                      background-color: #4CAF50;
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
                      <h1>Produto Enviado</h1>
                  </div>
                  <div class="content">
                      <p>Olá, ${productName}</p>
                      <p>Estamos felizes em informar que o seu produto foi enviado com sucesso!</p>
                      <p>Obrigado por comprar conosco.</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2023 Sua Empresa. Todos os direitos reservados.</p>
                  </div>
              </div>
          </body>
          </html>
               `
  }