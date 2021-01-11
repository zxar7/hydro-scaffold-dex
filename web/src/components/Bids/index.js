import React from 'react';
import { connect } from 'react-redux';

import './styles.scss'

const Bids = (props) => {
    const { bids, currentMarket, limit = 20 } = props;
    let totalAmount = 0;
    const actualBidValues = bids.slice(0, 20).toArray();

    const bidValueObjects = actualBidValues.map(([price, amount]) => {
        totalAmount += Number(amount.toFixed(currentMarket.amountDecimals))
        return {
            amount: amount.toFixed(currentMarket.amountDecimals),
            price: price.toFixed(currentMarket.priceDecimals),
            total: (amount * price).toFixed(currentMarket.priceDecimals),
        }
    }) || [];
    bidValueObjects.forEach(item => {
        item.width = (Number(item.amount) / totalAmount) * 100;
    });

    const emptyRows = new Array(Math.abs(limit - actualBidValues.length)).fill(
        <div className="bid flex align-items-center">
            <div className="col-4 orderbook-amount text-center">-</div>
            <div className="col-4 text-success text-center">-</div>
            <div className="col-4 text-center">-</div>
        </div>
    );

    return (
        <div className="bids flex-column flex-1 ">
            {bidValueObjects
                .map((bidRow) => {
                    const { amount, price, width, total } = bidRow;
                    return (
                        <div className="bid flex align-items-center" key={price.toString()}>
                            <div className="col-4 orderbook-amount text-center">
                                {amount}
                                <span className='volume-bar' style={{ "width": `${width}%` }} />
                            </div>
                            <div className="col-4 text-success text-center">{price}</div>
                            <div className="col-4 text-center">{total}</div>
                        </div>
                    );
                })
                .concat([...emptyRows])}
        </div>
    )

}


const mapStateToProps = state => {
    return {
        bids: state.market.getIn(['orderbook', 'bids']),
        currentMarket: state.market.getIn(['markets', 'currentMarket']),
    };
};

export default connect(mapStateToProps)(Bids);