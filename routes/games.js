// ========== routes/games.js ==========
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Münzwurf
router.post('/coinflip', async (req, res) => {
  const { betAmount, choice } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  if (betAmount > user.coins) return res.status(400).json({ error: 'Zu wenig Münzen' });

  const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
  user.coins += (outcome === choice ? betAmount : -betAmount);
  await user.save();
  res.json({ outcome, coins: user.coins });
});

// Blackjack
router.post('/blackjack', async (req, res) => {
  const { betAmount } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  if (betAmount > user.coins) return res.status(400).json({ error: 'Zu wenig Münzen' });

  // Kartendeck erstellen & mischen
  const suits = ['♠','♥','♦','♣'];
  const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  let deck = [];
  suits.forEach(suit => values.forEach(value => deck.push({ suit, value })));
  deck.sort(() => Math.random() - 0.5);

  const calcValue = hand => {
    let sum = 0, aces = 0;
    hand.forEach(card => {
      if (['J','Q','K'].includes(card.value)) sum += 10;
      else if (card.value === 'A') { sum += 11; aces++; }
      else sum += +card.value;
    });
    while (sum > 21 && aces) { sum -= 10; aces--; }
    return sum;
  };

  const player = [deck.pop(), deck.pop()];
  const dealer = [deck.pop(), deck.pop()];
  let pVal = calcValue(player), dVal = calcValue(dealer);
  while (pVal < 17) { player.push(deck.pop()); pVal = calcValue(player); }
  while (dVal < 17) { dealer.push(deck.pop()); dVal = calcValue(dealer); }

  let result;
  if (pVal > 21) result = 'verloren';
  else if (dVal > 21 || pVal > dVal) result = 'gewonnen';
  else if (pVal < dVal) result = 'verloren';
  else result = 'unentschieden';

  user.coins += result === 'gewonnen' ? betAmount : result === 'verloren' ? -betAmount : 0;
  await user.save();
  res.json({ result, player, dealer, coins: user.coins });
});

module.exports = router;
