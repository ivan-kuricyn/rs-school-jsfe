import styles from './Questions.css';
import shared from '@/styles/styles.css';

import { Progress } from '@/components/Progress';
import { AuthorsQuestion } from '@/components/AuthorsQuestion';
import { PicturesQuestion } from '@/components/PicturesQuestion';
import { Answer } from '@/components/Answer';
import { Footer } from '@/components/Footer';
import { Time } from '@/components/Time';
import { Result } from '@/components/Result';
import { GameOver } from '@/components/GameOver';
import { Exit } from '@/components/Exit';
import { IconButton } from '@/components/IconButton';

import exit from '@/assets/img/exit.png';

import rightSound from '@/assets/sounds/right.mp3';
import wrongSound from '@/assets/sounds/wrong.mp3';
import gameOverSound from '@/assets/sounds/game-over.mp3';
import resultSound from '@/assets/sounds/result.mp3';

export class Questions {
  constructor(groupNumber, imageNumber) {
    this.imageNumber = imageNumber;
    this.questionNumber = 0;
    this.score = 0;

    const onAnyAnswerButtonClick = async isRightAnswer => {
      if (this.time) this.time.stop();

      if (isRightAnswer) {
        this.score += 1;
      }

      this.answer.imageNumber = this.imageNumber;
      this.answer.isRightAnswer = isRightAnswer;
      await this.answer.rerender();

      if (isRightAnswer) {
        this.rightSound.play();
      } else {
        this.wrongSound.play();
      }

      const sliderElement = document.querySelector(`.${styles.slider}`);
      sliderElement.classList.toggle(`${styles.moved}`);
    };

    if (groupNumber === 0) {
      this.question = new AuthorsQuestion(this.imageNumber, onAnyAnswerButtonClick);
    } else {
      this.question = new PicturesQuestion(this.imageNumber, onAnyAnswerButtonClick);
    }

    const onNextButtonClick = async () => {
      this.imageNumber += 1;
      this.questionNumber += 1;

      await this.progress.stepUp();

      if (this.questionNumber < 10) {
        if (this.time) this.time.reset();
        if (this.time) this.time.run();

        this.question.imageNumber = this.imageNumber;
        await this.question.rerender();
      } else {
        const firstSlideElement = document.querySelector(`.${styles.slide}`);
        const questionElement = firstSlideElement.firstElementChild;
        questionElement.remove();

        const result = new Result(this.score, imageNumber, groupNumber);
        firstSlideElement.innerHTML = await result.render();
        result.afterRender();

        this.resultSound.play();
      }

      const sliderElement = document.querySelector(`.${styles.slider}`);
      sliderElement.classList.toggle(`${styles.moved}`);
    };

    this.answer = new Answer(this.imageNumber, onNextButtonClick);

    this.progress = new Progress();

    if (localStorage.getItem('time') === 'true') {
      const onTimeExpired = async () => {
        const secondSlideElement = document.querySelectorAll(`.${styles.slide}`)[1];
        const answerElement = secondSlideElement.firstElementChild;
        answerElement.remove();

        const gameOver = new GameOver(imageNumber, groupNumber);
        secondSlideElement.innerHTML = await gameOver.render();
        await gameOver.afterRender();

        this.gameOverSound.play();

        const sliderElement = document.querySelector(`.${styles.slider}`);
        sliderElement.classList.toggle(`${styles.moved}`);
      };

      this.time = new Time(onTimeExpired);
    }

    this.exit = new Exit();

    const onExitButtonClick = () => {
      this.exit.show();
    };

    this.exitButton = new IconButton(exit, '', onExitButtonClick);

    this.rightSound = new Audio(rightSound);
    this.wrongSound = new Audio(wrongSound);
    this.gameOverSound = new Audio(gameOverSound);
    this.resultSound = new Audio(resultSound);
    this.rightSound.volume = Number(localStorage.getItem('volume') ?? 50) / 100;
    this.wrongSound.volume = Number(localStorage.getItem('volume') ?? 50) / 100;
    this.gameOverSound.volume = Number(localStorage.getItem('volume') ?? 50) / 100;
    this.resultSound.volume = Number(localStorage.getItem('volume') ?? 50) / 100;

    this.footer = new Footer();
  }

  async render() {
    return `
      <div class="${shared['fade-transition']} ${shared.active}"></div>
      ${await this.exit.render()}
      <header class="${styles.header}">
        <div class="${styles.progress}">
          ${await this.progress.render()}
        </div>
        <div class="${styles['exit-button']}">
          ${await this.exitButton.render()}
        </div>
      </header>
      <main class="${styles.main}">
        ${this.time ? `<div class="${styles['time-container']}">${await this.time.render()}</div>` : ''}
        <div class="${styles.slider}">
          <div class="${styles.slide}">
            ${await this.question.render()}
          </div>  
          <div class="${styles.slide}">
            ${await this.answer.render()}
          </div>
        </div>
      </main>
      ${await this.footer.render()}
    `;
  }

  async afterRender() {
    this.exit.afterRender();
    this.exitButton.afterRender();
    this.question.afterRender();
    this.answer.afterRender();

    if (this.time) this.time.afterRender();

    setTimeout(() => {
      const transitionElement = document.querySelector(`.${shared['fade-transition']}`);
      transitionElement.classList.toggle(`${shared.active}`);
    }, 500);
  }
}
