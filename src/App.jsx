import { Box, Button, Container, Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const [deck, setDeck] = useState([])

  function handleNewGame() {
    async function getNewDeck() {
      const deckData = await axios({
        method: "get",
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
        responseType: "json",
      })

      const deckID = deckData.data.deck_id

      const cardsData = await axios({
        method: "get",
        url: `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`,
        responseType: "json",
      })

      const deck = cardsData.data.cards

      setDeck(deck)
    }

    getNewDeck()
  }

  const cards = deck.map((card) => {
    return (
      <Grid item key={card.code} xs={1}>
        <img src={card.image} width={"100%"} />
      </Grid>
    )
  })

  return (
    <Container width="xs" sx={{ backgroundColor: "red" }}>
      <Grid container spacing={2} sx={{ marginTop: "10%" }}>
        <Grid item xs={12}>
          <Button onClick={handleNewGame} variant="outlined">
            New Game
          </Button>
        </Grid>
        <Grid container item xs={12} spacing={1.5}>
          {cards}
        </Grid>
        <Grid item xs={8}>
          <Typography>Current Score</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Best Score</Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
