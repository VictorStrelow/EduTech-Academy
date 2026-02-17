document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MODO CLARO/ESCURO (DARK MODE)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Verifica se o usuário já escolheu um tema antes
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if(themeToggleBtn) themeToggleBtn.innerText = '☀️ Modo Claro';
    }

    // Adiciona o evento de clique no botão
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Alterna a classe no body
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            // Salva a escolha no navegador do usuário
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Muda o texto do botão
            themeToggleBtn.innerText = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
        });
    }

    // 2. API VIACEP (PREENCHIMENTO AUTOMÁTICO)
    const cepInput = document.getElementById('cep');

    if (cepInput) {
        // O evento 'blur' acontece quando você clica FORA do campo
        cepInput.addEventListener('blur', async (e) => {
            // Remove tudo que não for número (traços, pontos, espaços)
            let cep = e.target.value.replace(/\D/g, ''); 

            if (cep.length === 8) {
                try {
                    // Faz a requisição para a API
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (!data.erro) {
                        // Se deu certo, preenche os campos
                        setValue('endereco', data.logradouro);
                        setValue('bairro', data.bairro);
                        setValue('cidade', data.localidade);
                        setValue('estado', data.uf);
                        removeError(cepInput);
                    } else {
                        showError(cepInput, 'CEP não encontrado.');
                    }
                } catch (error) {
                    showError(cepInput, 'Erro ao conectar com a API.');
                }
            } else {
                showError(cepInput, 'CEP deve conter 8 dígitos.');
            }
        });
    }

    // Funçãozinha para encurtar o código de preencher valor
    function setValue(id, value) {
        const field = document.getElementById(id);
        if (field) field.value = value;
    }

    // 3. VALIDAÇÃO DE FORMULÁRIO
    const form = document.getElementById('form-matricula');

    if (form) {
        form.addEventListener('submit', (e) => {
            // "preventDefault" impede que a página recarregue enviando o formulário
            e.preventDefault(); 
            let isValid = true;

            // Validação do Nome
            const nomeInput = document.getElementById('nome');
            if (nomeInput.value.trim().length < 3) {
                showError(nomeInput, 'Por favor, preencha o nome completo.');
                isValid = false;
            } else {
                removeError(nomeInput);
            }

            // Validação do Email (Regex simples)
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'Informe um e-mail válido.');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            // Validação do CEP (verifica se está preenchido)
            if (cepInput && cepInput.value.replace(/\D/g, '').length !== 8) {
                showError(cepInput, 'Informe o CEP corretamente.');
                isValid = false;
            }

            // Se isValid continuar sendo 'true', o formulário está OK
            if (isValid) {
                alert('Matrícula enviada com sucesso! (Simulação)');
                form.reset(); // Limpa os campos
            }
        });
    }

    // 4. FUNÇÕES VISUAIS DE ERRO
    function showError(input, message) {
        const formGroup = input.parentElement; // Pega a div pai do input
        const small = formGroup.querySelector('.error-msg'); // Pega o texto de erro
        
        formGroup.classList.add('error'); // Adiciona borda vermelha (via CSS)
        
        if (small) {
            small.innerText = message; // Muda o texto do erro
        }
    }

    function removeError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error'); // Remove borda vermelha
    }
});