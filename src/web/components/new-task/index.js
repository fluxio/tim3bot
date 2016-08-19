import React, { Component, PropTypes } from 'react';

import styles from './new-task.scss';

const defaultState = {
  title: '',
  estimate: '',
  isValid: false,
};

class NewTask extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this._updateTitle = this.updateTitle.bind(this);
    this._updateEstimate = this.updateEstimate.bind(this);
    this._handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { isValid, title, estimate } = this.state;

    if (isValid) {
      this.props.createTask({ title, estimate });

      this.setState(defaultState);
    }
  }

  updateTitle(e) {
    const title = e.target.value;

    this.setState({
      title,
      isValid: this.validate({
        title,
        estimate: this.state.estimate,
      }),
    });
  }

  updateEstimate(e) {
    const estimate = Number(e.target.value);

    this.setState({
      estimate,
      isValid: this.validate({
        estimate,
        title: this.state.title,
      }),
    });
  }

  validate({ title, estimate }) {
    return title && !Number.isNaN(Number(estimate));
  }

  render() {
    const { isValid, title, estimate } = this.state;

    return (
      <div className={styles.newTask}>
        <form onSubmit={this._handleSubmit} className={styles.form}>
          <button
            className={styles.submit}
            disabled={!isValid}
          >
            +
          </button>
          <fieldset className={styles.fieldset}>
            <label
              htmlFor="title"
              className={styles.label}
            >
              What's next on the docket?
            </label>
            <input
              id="title"
              className={styles.input}
              value={title}
              onChange={this._updateTitle}
              placeholder="Make something fancy!"
            />
            <label
              htmlFor="estimate"
              className={styles.label}
            >
              How long do you think it will take? (In days)
            </label>
            <input
              id="title"
              className={styles.input}
              value={estimate}
              onChange={this._updateEstimate}
              placeholder="1.5"
            />
          </fieldset>
        </form>
      </div>
    );
  }
}

NewTask.propTypes = {
  createTask: PropTypes.func.isRequired,
};

export default NewTask;
