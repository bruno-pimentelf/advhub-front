# Configuração do EmailJS

## Configuração Rápida com EmailJS

O EmailJS é a forma mais simples de enviar emails diretamente do frontend, sem precisar de servidor.

### 1. Criar conta no EmailJS

1. Acesse [EmailJS](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Faça login no dashboard

### 2. Configurar Email Service

1. No dashboard, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha **Gmail** (ou outro provedor)
4. Conecte sua conta Gmail (`ailumcrm@gmail.com`)
5. Anote o **Service ID** gerado

### 3. Criar Template de Email

1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Use este template:

**Subject:** Nova Aplicação - Ailum CRM

**Content:**
```
Nova aplicação recebida!

INFORMAÇÕES PESSOAIS:
Nome: {{from_name}}
Email: {{from_email}}
Telefone: {{phone}}

DADOS DA CLÍNICA:
Nome da Clínica: {{clinic_name}}
Especialidades: {{specialties}}
Atendimentos por mês: {{monthly_appointments}}
Possui secretária: {{has_secretary}}

INFORMAÇÕES FINANCEIRAS:
Investe em mídia paga: {{paid_media}}
Investimento mensal: {{monthly_investment}}
Faturamento mensal: {{monthly_revenue}}

EXPECTATIVAS:
Principais desafios: {{main_challenges}}

O que gostaria de melhorar: {{improvements}}

Por que deve ser selecionada: {{why_selected}}

Data do envio: {{submission_date}}
```

4. Anote o **Template ID** gerado

### 4. Obter Public Key

1. Vá em **Account** > **General**
2. Copie sua **Public Key**

### 5. Configurar no Projeto

1. Abra o arquivo `lib/email-service.ts`
2. Substitua os valores:

```typescript
const EMAILJS_SERVICE_ID = 'seu_service_id_aqui'
const EMAILJS_TEMPLATE_ID = 'seu_template_id_aqui'
const EMAILJS_PUBLIC_KEY = 'sua_public_key_aqui'
```

### 6. Testar

1. Execute: `pnpm dev`
2. Acesse a landing page
3. Preencha o formulário
4. Verifique se o email chegou em `ailumcrm@gmail.com`

## Estrutura do Email

O email enviado contém:
- Informações pessoais (nome, email, telefone)
- Dados da clínica (nome, especialidades, atendimentos)
- Informações financeiras (investimento, faturamento)
- Expectativas e desafios
- Data e hora do envio

## Troubleshooting

- **Erro de autenticação**: Verifique se a senha de app está correta
- **Email não enviado**: Verifique os logs do console
- **Timeout**: Verifique a conexão com a internet
