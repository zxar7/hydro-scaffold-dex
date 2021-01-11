import React from 'react';
import { connect } from 'react-redux';

import './styles.scss'

const Asks = (props) => {
  const { asks, currentMarket, limit = 20 } = props;
  let totalAmount = 0;

  const actualAskValues = asks.slice(0, 20).toArray();
  const askValueObjects = actualAskValues.map(([price, amount]) => {
    totalAmount += Number(amount.toFixed(currentMarket.amountDecimals))
    return {
      amount: amount.toFixed(currentMarket.amountDecimals),
      price: price.toFixed(currentMarket.priceDecimals),
      total: (amount * price).toFixed(currentMarket.priceDecimals),
    }
  });
  askValueObjects.forEach(item => {
    item.width = (Number(item.amount) / totalAmount) * 100;
  });

  const emptyRows = new Array(Math.abs(limit - actualAskValues.length)).fill(
    <div className={`bid flex align-items-center`}>
      <div className="col-4 orderbook-amount text-center">-</div>
      <div className="col-4 text-danger text-center">-</div>
      <div className="col-4 text-center">-</div>
    </div>
  );

  return (
    <div className="asks flex-column flex-column-reverse flex-1">
      {askValueObjects
        .map((askRow) => {
          const { width, amount, price, total } = askRow;
          return (
            <div className="ask flex align-items-center" key={price.toString()}>
              <div className="col-4 orderbook-amount text-center">
                {amount}
                <span className='volume-bar' style={{ width: `${width}%` }} />
              </div>
              <div className="col-4 text-danger text-center">{price}</div>
              <div className="col-4 text-center">{total}</div>
            </div>
          );
        })
        .concat([...emptyRows])}
    </div >
  )
}


const mapStateToProps = state => {
  return {
    asks: state.market.getIn(['orderbook', 'asks']),
    currentMarket: state.market.getIn(['markets', 'currentMarket']),
  };
};

export default connect(mapStateToProps)(Asks);