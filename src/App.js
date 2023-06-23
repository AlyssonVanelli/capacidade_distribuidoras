import React, { useState } from 'react';
import './App.css';
import { FaPencilAlt, FaSave } from 'react-icons/fa';

const App = () => {
  const { isAuthenticated, isLoading, error, logout, user } = useAuth0();
  const [nomeDistribuidora, setNomesDistribuidoras] = useState('');
  const [capacidades, setCapacidades] = useState([
    {
      semana: 1,
      distribuidora: 'Cogny',
      produtos: {
        A: [null, null, null, null, null],
        I: [null, null, null, null, null],
        S: [null, null, null, null, null]
      }
    },
    {
      semana: 2,
      distribuidora: 'Cogny',
      produtos: {
        A: [null, null, null, null, null],
        I: [null, null, null, null, null],
        S: [null, null, null, null, null]
      }
    },
    {
      semana: 3,
      distribuidora: 'Cogny',
      produtos: {
        A: [null, null, null, null, null],
        I: [null, null, null, null, null],
        S: [null, null, null, null, null]
      }
    },
    {
      semana: 4,
      distribuidora: 'Cogny',
      produtos: {
        A: [null, null, null, null, null],
        I: [null, null, null, null, null],
        S: [null, null, null, null, null]
      }
    }
  ]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductValue, setEditingProductValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3003/relacao_usuario_distribuidora', {
          headers: {
            'username': 'cogny',
            'password': '@s8mpEf4wRrdD0&Wn^jI0z0Q8h$9aXxTi9Fc!m%Yn74zG4P@6l'
          },
        });
        const usuarioLogado = response.data.filter((item) => item.email === user.email);
        const distribuidoras = usuarioLogado.map((item) => item.distribuidora);

        // Fazer a segunda requisição para obter os nomes das distribuidoras
        const responseDistribuidoras = await axios.get('http://localhost:3003/distribuidoras', {
          headers: {
            'username': 'cogny',
            'password': '@s8mpEf4wRrdD0&Wn^jI0z0Q8h$9aXxTi9Fc!m%Yn74zG4P@6l'
          },
        });

        // Encontrar os nomes das distribuidoras do usuário logado
        const nomesDistribuidoras = responseDistribuidoras.data
          .filter((item) => distribuidoras.includes(item.cod))
          .map((item) => item.nome);

        setNomesDistribuidoras(nomesDistribuidoras);
      } catch (error) { }
    };

    fetchData();
  }, [user]);

  const handleQuantidadeChange = (semanaIndex, produto, dia, quantidade) => {
    const capacidadesCopy = [...capacidades];
    const semanaAtual = capacidadesCopy[semanaIndex];
    semanaAtual.produtos[produto] = semanaAtual.produtos[produto] || {};
    semanaAtual.produtos[produto][dia] = quantidade === '' ? null : parseInt(quantidade, 10);
    setCapacidades(capacidadesCopy);

    if (editingProduct === `${semanaIndex} - ${produto} - ${dia}`) {
      setEditingProductValue(quantidade);
    }
  };

  const handleEditClick = (semana, tipoProduto, dia) => {
    setEditingProduct(`${semana} - ${tipoProduto} - ${dia}`);
    const semanaIndex = capacidades.findIndex((item) => item.semana === semana);
    if (semanaIndex !== -1) {
      const semanaAtual = capacidades[semanaIndex];
      const valor = semanaAtual.produtos[tipoProduto][dia] || '';
      setEditingProductValue(valor);
    }
  };

  const handleSaveClick = (semana, produto, dia) => {
    console.log(`${semana} - ${produto} - ${dia} - ${editingProductValue}`);
    setEditingProduct(null);
    const capacidadesCopy = [...capacidades];
    const semanaAtual = capacidadesCopy[semana];
    semanaAtual.produtos[produto][dia] = parseInt(editingProductValue, 10) || null;
    setCapacidades(capacidadesCopy);
    setEditingProductValue('');
  };

  const getWeekDates = (weekIndex) => {
    const startDate = new Date();
    startDate.setDate(1); // Define o dia como o primeiro dia do mês
    const firstDayOfWeek = 1; // Segunda-feira

    const dayOffset = (firstDayOfWeek - startDate.getDay() + 7) % 7;
    startDate.setDate(startDate.getDate() + dayOffset + (weekIndex - 1) * 7); // Encontra o primeiro dia da semana

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // Define o dia da semana como sexta-feira

    return `${startDate.getDate()} a ${endDate.getDate()}`;
  };

  const renderWeeks = () => {
    const weeks = [];

    for (let i = 0; i < 4; i++) {
      const weekDates = getWeekDates(i + 1);
      const semanaAtual = capacidades[i];

      weeks.push(
        <div key={i}>
          <table >
            <thead>
              <tr>
                <th>{`${semanaAtual.semana}S ${currentMonth.toUpperCase()} ${weekDates}`}</th>
                <th className="empty-cell"></th>
                <th>{'Segunda'}</th>
                <th className="empty-cell"></th>
                <th>{'Terça'}</th>
                <th className="empty-cell"></th>
                <th>{'Quarta'}</th>
                <th className="empty-cell"></th>
                <th>{'Quinta'}</th>
                <th className="empty-cell"></th>
                <th>{'Sexta'}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="4">Distribuidora Teste</td>
              </tr>
              {renderProdutosRow(semanaAtual.produtos.A, 'AGROTOXICO', i)}
              {renderProdutosRow(semanaAtual.produtos.I, 'INOCULANTE', i)}
              {renderProdutosRow(semanaAtual.produtos.S, 'SEMENTE', i)}
            </tbody>
          </table>
        </div >
      );
    }

    return weeks;
  };

  const renderProdutosRow = (produtos, tipoProduto, semana) => {
    return (
      <tr>
        {[1, 2, 3, 4, 5].map((dia) => (
          <React.Fragment key={dia}>
            <td>{tipoProduto}</td>
            <td className="vertical-align">
              <input
                className="quantity-input"
                value={editingProduct !== `${semana} - ${tipoProduto} - ${dia}` ? (produtos && produtos[dia]) || '' : editingProductValue}
                type="number"
                disabled={editingProduct !== `${semana} - ${tipoProduto} - ${dia}`}
                onChange={(e) => handleQuantidadeChange(semana, tipoProduto, dia, e.target.value)}
              />
              {editingProduct !== `${semana} - ${tipoProduto} - ${dia}` ? (
                <FaPencilAlt className="edit-icon" onClick={() => handleEditClick(semana, tipoProduto, dia)} />
              ) : (
                <FaSave className="save-icon" onClick={() => handleSaveClick(semana, tipoProduto, dia)} />
              )}
            </td>
          </React.Fragment>
        ))}
      </tr>
    );
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="container background-image">
      <div className="logo-container">
        <div className="logo"></div>
        <h1>PAINEL DE CAPACIDADE</h1>
      </div>
      {renderWeeks()}
    </div>
  );
};

export default App;
