import React from 'react';
import ReactDOM from 'react-dom';
import CreateReactClass from 'create-react-class';

//React component for input component
var MyInput = CreateReactClass({
    //onchange event
    handleChange: function (e) {
        this.props.onChange(e.target.value);
        var isValidField = this.isValid(e.target);
    },
    //validation function
    isValid: function (input) {
        //check required field
        if (input.getAttribute('required') != null && input.value === "") {
            input.classList.add('error'); //add class error
            input.nextSibling.textContent = this.props.messageRequired; // show error message
            return false;
        }
        else {
            input.classList.remove('error');
            input.nextSibling.textContent = "";
        }
        //check data type // here I will show you email validation // we can add more and will later
        if (input.getAttribute('type') == "email" && input.value != "") {
            if (!this.validateEmail(input.value)) {
                input.classList.add('error');
                input.nextSibling.textContent = this.props.messageRequired;
                return false;
            }
            else {
                input.classList.remove('error');
                input.nextSibling.textContent = "";
            }
        }
        return true;
    },
    //email validation function
    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    componentDidMount: function () {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this); //register this input in the form
        }
    },
    //render
    render: function () {
        var inputField;
        if (this.props.type == 'textarea') {
            inputField = <textarea value={this.props.value} ref={this.props.name} name={this.props.name}
                className='form-control' required={this.props.isrequired} onChange={this.handleChange} />
        }
        else {
            inputField = <input type={this.props.type} value={this.props.value} ref={this.props.name} name={this.props.name}
                className='form-control' required={this.props.isrequired} onChange={this.handleChange} />
        }
        return (
            <div className="form-group">
                <label htmlFor={this.props.htmlFor}>{this.props.label}:</label>
                {inputField}
                <span className="error"></span>
            </div>
        );
    }
});

//React component for generate form
var ContactForm = CreateReactClass({
    //get initial state event
    getInitialState: function () {
        return {
            Firstname: '',
            Lastname: '',
            Street: '',
            Unit: '',
            Email: '',
            Fields: [],
            ServerMessage: ''
        }
    },
    // submit function
    handleSubmit: function (e) {
        e.preventDefault();
        //Validate entire form here
        var validForm = true;
        this.state.Fields.forEach(function (field) {
            if (typeof field.isValid === "function") {
                var validField = field.isValid(field.refs[field.props.name]);
                validForm = validForm && validField;
            }
        });
        //after validation complete post to server 
        if (validForm) {
            var d = {
                Firstname: this.state.Firstname,
                Lastname: this.state.Lastname,
                Street: this.state.Street,
                Unit: this.state.Unit,
                Email: this.state.Email
            }

            $.ajax({
                type: "POST",
                url: this.props.urlPost,
                data: d,
                success: function (data) {
                    //Will clear form here
                    this.setState({
                        Firstname: '',
                        Lastname: '',
                        Street: '',
                        Unit: '',
                        Email: '',
                        ServerMessage: data.message
                    });
                }.bind(this),
                error: function (e) {
                    console.log(e);
                    alert('Error! Please try again');
                }
            });
        }
    },
    //handle change first name
    onChangeFirstname: function (value) {
        this.setState({
            Firstname: value
        });
    },
    //handle change last name
    onChangeLastname: function (value) {
        this.setState({
            Lastname: value
        });
    },
    //handle change street address
    onChangeStreet: function (value) {
        this.setState({
            Street: value
        });
    },
    //handle change Unit/Apt
    onChangeUnit: function (value) {
        this.setState({
            Unit: value
        });
    },
    //handle chnage email
    onChangeEmail: function (value) {
        this.setState({
            Email: value
        });
    },
    //register input controls
    register: function (field) {
        var s = this.state.Fields;
        s.push(field);
        this.setState({
            Fields: s
        })
    },
    //render
    render: function () {
        //Render form 
        return (
            <form name="contactForm" noValidate onSubmit={this.handleSubmit}>
                <MyInput type={'text'} value={this.state.Firstname} label={'First Name'} name={'Firstname'} htmlFor={'Firstname'} isrequired={true}
                    onChange={this.onChangeFirstname} onComponentMounted={this.register} messageRequired={'FirstName required'} />
                <MyInput type={'text'} value={this.state.Lastname} label={'Last Name'} name={'Lastname'} htmlFor={'Lastname'} isrequired={true}
                    onChange={this.onChangeLastname} onComponentMounted={this.register} messageRequired={'LastName required'} />
                <MyInput type={'text'} value={this.state.Street} label={'Street Address'} name={'Street'} htmlFor={'Street'} isrequired={true}
                    onChange={this.onChangeStreet} onComponentMounted={this.register} messageRequired={'Street Address required'} />
                <MyInput type={'text'} value={this.state.Unit} label={'Unit/Apt'} name={'Unit'} htmlFor={'Unit'} isrequired={false}
                    onChange={this.onChangeUnit} onComponentMounted={this.register} messageRequired={'Unit/Apt required'} />
                <MyInput type={'email'} value={this.state.Email} label={'Email'} name={'Email'} htmlFor={'Email'} isrequired={true}
                    onChange={this.onChangeEmail} onComponentMounted={this.register} messageRequired={'Invalid Email'} />
                <button type="submit" className="btn btn-default">Submit</button>
                <p className="servermessage">{this.state.ServerMessage}</p>
            </form>
        );
    }
});

//Render react component into the page
ReactDOM.render(<ContactForm urlPost="/Contact/SaveContactData" />, document.getElementById('root'));