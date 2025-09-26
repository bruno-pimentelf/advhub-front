# Exemplo de Configuração EmailJS

## Passo a Passo Detalhado

### 1. Acesse o EmailJS
- Vá para: https://www.emailjs.com/
- Clique em "Sign Up" e crie uma conta gratuita

### 2. Configure o Email Service
1. No dashboard, clique em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha **"Gmail"**
4. Conecte com a conta `ailumcrm@gmail.com`
5. **Anote o Service ID** (ex: `service_abc123`)

### 3. Crie o Template
1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure:

**Template Name:** `Ailum Application Form`

**Subject:** `Nova Aplicação - Ailum CRM`

**Content:**
```
Nova aplicação recebida!

=== INFORMAÇÕES PESSOAIS ===
Nome: {{from_name}}
Email: {{from_email}}
Telefone: {{phone}}

=== DADOS DA CLÍNICA ===
Nome da Clínica: {{clinic_name}}
Especialidades: {{specialties}}
Atendimentos por mês: {{monthly_appointments}}
Possui secretária: {{has_secretary}}

=== INFORMAÇÕES FINANCEIRAS ===
Investe em mídia paga: {{paid_media}}
Investimento mensal: {{monthly_investment}}
Faturamento mensal: {{monthly_revenue}}

=== EXPECTATIVAS ===
Principais desafios:
{{main_challenges}}

O que gostaria de melhorar:
{{improvements}}

Por que deve ser selecionada:
{{why_selected}}

Data do envio: {{submission_date}}
```

4. **Anote o Template ID** (ex: `template_xyz789`)

### 4. Obtenha a Public Key
1. Vá em **"Account"** > **"General"**
2. Copie a **"Public Key"** (ex: `user_abc123def456`)

### 5. Configure no Código
Abra o arquivo `lib/email-service.ts` e substitua:

```typescript
const EMAILJS_SERVICE_ID = 'service_abc123' // Seu Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789' // Seu Template ID  
const EMAILJS_PUBLIC_KEY = 'user_abc123def456' // Sua Public Key
```

### 6. Teste
1. Execute: `pnpm dev`
2. Acesse a landing page
3. Preencha o formulário
4. Verifique o email em `ailumcrm@gmail.com`

## Vantagens do EmailJS
- ✅ **Gratuito** até 200 emails/mês
- ✅ **Sem servidor** necessário
- ✅ **Configuração simples**
- ✅ **Templates visuais**
- ✅ **Logs de envio**
