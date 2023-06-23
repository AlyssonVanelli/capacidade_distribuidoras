import React, { useState } from 'react';
import './App.css';
import { FaPencilAlt, FaSave } from 'react-icons/fa';

const App = () => {
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
  const [currentValue, setCurrentValue] = useState('')

  const handleQuantidadeChange = (semanaIndex, produto, dia, quantidade) => {
    const capacidadesCopy = [...capacidades];
    const semanaAtual = capacidadesCopy[semanaIndex];
    semanaAtual.produtos[produto] = semanaAtual.produtos[produto] || {}; // Verifica se a estrutura existe, caso contrário cria um objeto vazio
    semanaAtual.produtos[produto][dia] = quantidade === '' ? null : parseInt(quantidade, 10);
    setCapacidades(capacidadesCopy);
  };

  const handleEditClick = (semana, tipoProduto, dia, setCurrentValue, VALOR_GERAL) => {
    setEditingProduct(`${semana} - ${tipoProduto} - ${dia} - ${setCurrentValue}`);
    setCurrentValue(VALOR_GERAL)
  };

  const handleSaveClick = (semana, produto, dia) => {
    console.log(`${semana} - ${produto} - ${dia}`)
    // Lógica para salvar os dados
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
                value={editingProduct !== `${semana} - ${tipoProduto} - ${dia}` ? setCurrentValue : currentValue}
                type="number"
                disabled={editingProduct !== `${semana} - ${tipoProduto} - ${dia}`}
                defaultValue={produtos[dia] !== null ? produtos[dia] : ''}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
              {editingProduct !== `${semana} - ${tipoProduto} - ${dia}` ?
                <FaPencilAlt className="edit-icon" onClick={() => handleEditClick(semana, tipoProduto, dia, setCurrentValue)} />
                :
                <FaSave className="save-icon" onClick={handleSaveClick} />
              }
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