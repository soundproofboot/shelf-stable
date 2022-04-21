const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {

      console.log('this is the user from context',  context.user)
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id})
          .select('-__v -password');

          console.log('this is the user data returned', userData)
          return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    // login
    login: async(parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    // addUser
    addUser: async(parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // saveBook
    saveBook: async(parent, bookData, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in');
    },
    // removeBook
    removeBook: async(parent, args, context) => {
      console.log(args);
      console.log(context.user);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

        console.log(updatedUser);
        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
}

module.exports = resolvers;