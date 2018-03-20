const synaptic = require('synaptic');
const Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

class Machine {
    constructor() {
        this.network = null;
        this.trainer = null;
    }

    train(data, options) {
        this.trainer = new Trainer(this.network);
        return this.trainer.train(data, options);
    }

    predict(input) {
        return this.network.activate(input);
    }

    toJSON() {
        return this.network.toJSON()
    }
}

const fromConfig = (layerCfg) => {
    const machine = new Machine();
    machine.network = new Architect.Perceptron(...layerCfg);
    return machine;
};

const fromJSON = (json) => {
    const machine = new Machine();
    machine.network = Network.fromJSON(json);
    return machine;
};

module.exports = {
    fromConfig : fromConfig,
    fromJSON : fromJSON
};