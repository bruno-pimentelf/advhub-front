# Google Ads Tracking - Ailum CRM

## 📊 Configuração Implementada

Este projeto está configurado com o Google Ads tracking para monitorar conversões e leads gerados através do formulário de aplicação.

### 🏗️ Estrutura Implementada

```
components/analytics/
├── google-tag.tsx          # Componente principal do Google Tag
hooks/
├── use-conversion-tracking.ts  # Hook para tracking de conversões
lib/
├── analytics-config.ts     # Configurações centralizadas
```

### 🔧 Configurações

**Google Ads ID:** `AW-17611568524`
**Conversion ID:** `AW-17611568524/mztSCLTalqQbEIzr7M1B`

### 📍 Onde está implementado

1. **Tag Global:** Adicionada no `app/layout.tsx` - carrega em todas as páginas
2. **Tracking de Conversão:** Implementado no formulário de aplicação (`components/landing/multi-step-application-form.tsx`)

### 🎯 Eventos Rastreados

- **Lead Generation:** Quando o formulário de aplicação é enviado com sucesso
- **Conversion:** Evento de conversão do Google Ads
- **Custom Parameters:** Email, telefone, nome e nome da clínica

### 💻 Como Usar

#### 1. Tracking Automático
O tracking já está configurado automaticamente no formulário de aplicação. Quando um usuário preenche e envia o formulário, o evento é disparado automaticamente.

#### 2. Tracking Manual
Para adicionar tracking em outros componentes:

```typescript
import { useConversionTracking } from '@/hooks/use-conversion-tracking'

function MyComponent() {
  const { trackConversion, trackLeadGeneration } = useConversionTracking()
  
  const handleSubmit = () => {
    // Track conversion
    trackConversion()
    
    // Track lead with data
    trackLeadGeneration({
      email: 'user@example.com',
      phone: '+5511999999999',
      name: 'João Silva',
      clinicName: 'Clínica Exemplo'
    })
  }
}
```

#### 3. Configurações Personalizadas
Para modificar as configurações, edite o arquivo `lib/analytics-config.ts`:

```typescript
export const ANALYTICS_CONFIG = {
  GOOGLE_ADS_ID: 'AW-17611568524',
  GOOGLE_ADS_CONVERSION_ID: 'AW-17611568524/mztSCLTalqQbEIzr7M1B',
  // ... outras configurações
}
```

### 🔍 Verificação

Para verificar se o tracking está funcionando:

1. **Console do Browser:** Procure por logs como:
   - `🎯 Google Ads Conversion tracked:`
   - `📊 Lead Generation tracked:`

2. **Google Ads:** Verifique no painel do Google Ads se as conversões estão sendo registradas

3. **Google Tag Assistant:** Use a extensão do Chrome para verificar se os eventos estão sendo disparados

### 🚀 Funcionalidades

- ✅ **Tag Global:** Carregada automaticamente em todas as páginas
- ✅ **Tracking de Conversão:** Disparado no envio do formulário
- ✅ **Transaction ID Único:** Gerado automaticamente para evitar duplicatas
- ✅ **Custom Parameters:** Dados do lead incluídos no evento
- ✅ **TypeScript:** Totalmente tipado
- ✅ **Configuração Centralizada:** Fácil de manter e modificar

### 📝 Logs

O sistema gera logs detalhados no console:
- `🎯 Google Ads Conversion tracked:` - Confirmação de conversão
- `📊 Lead Generation tracked:` - Dados do lead capturado
- `Google Ads gtag não está disponível` - Aviso se o gtag não estiver carregado

### 🔧 Troubleshooting

**Problema:** Conversões não aparecem no Google Ads
**Solução:** 
1. Verifique se o ID está correto
2. Confirme se o gtag está carregando (verifique o console)
3. Aguarde até 24h para aparecer no painel

**Problema:** Erro de TypeScript
**Solução:** 
1. Verifique se as declarações globais estão importadas
2. Confirme se o `window.gtag` está definido

### 📊 Métricas Importantes

- **Conversion Rate:** Taxa de conversão dos visitantes
- **Cost per Lead:** Custo por lead gerado
- **Lead Quality:** Qualidade dos leads baseada nos dados capturados
- **ROI:** Retorno sobre investimento das campanhas

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0.0
