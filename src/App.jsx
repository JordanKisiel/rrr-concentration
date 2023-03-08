import { Box, Button, Container, Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import pregamePlaceholder from "../assets/pregamePlaceholder.png"
import cardBack from "../assets/card-back-black.png"

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

      //add extra revealed property to each card
      const deck = cardsData.data.cards.map((card) => {
        return {
          ...card,
          isRevealed: false,
        }
      })

      console.log(deck)

      setDeck(deck)
    }

    getNewDeck()
  }

  function handleCardClick(cardCode) {
    setDeck((prevDeck) => {
      return prevDeck.map((card) => {
        if (card.code === cardCode) {
          return {
            ...card,
            isRevealed: true,
          }
        } else {
          return card
        }
      })
    })
  }

  const cards = deck.map((card) => {
    return (
      <Grid item key={card.code} xs={1}>
        <img
          onClick={() => handleCardClick(card.code)}
          src={card.isRevealed ? card.image : cardBack}
          width={"100%"}
        />
      </Grid>
    )
  })

  return (
    <Container width="xs">
      <Grid container spacing={2} sx={{ marginTop: "5%" }}>
        <Grid item xs={12}>
          <Button onClick={handleNewGame} variant="outlined">
            New Game
          </Button>
        </Grid>
        <Grid
          container
          item
          xs={12}
          spacing={1.5}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {cards.length > 0 ? (
            cards
          ) : (
            <img src={pregamePlaceholder} width={"100%"}></img>
          )}
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
