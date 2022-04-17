// added all new file and code:
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models'); // changed: REMOVED THOUGHT
const { signToken } = require('../utils/auth');

// added:
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                // .populate('books')  // changed thoughts to books
                //removed:  .populate('friends');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
    },
    //added:
    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        loginUser: async (parent, { email, password }) => {
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
        // Changed addThought to saveBook but kept action as .create *** IS THIS RIGHT???? ***
        saveBook: async (parent, args, context) => {  // changed addThought to saveBook
            if (context.user) {

                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: {...args} } },  // ***THIS IS NOT CORRECT.  changed thoughts to books and thought._id to book._id
                    { new: true, runValidators: true }
                );
                return user; // changed thought to updatedUser, then changed to user
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // removed all reaction and friend code
        removeBook: async (parent, args, context) => {
            // console.log(args.bookId);
            if(context.user) {
                // console.log('trying to remove');
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } }},
                    { new: true }
                );

                return user;
            }

            throw new AuthenticationError('You need to be logged in to remove a book.');
        }
    }
};
module.exports = resolvers;