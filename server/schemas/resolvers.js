// added all new file and code:
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models'); // changed: Thought to Book
const { signToken } = require('../utils/auth');

// added:
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('books')  // changed thoughts to books
                    //removed:  .populate('friends');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
        books: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Book.find(params).sort({ createdAt: -1 });
        },
        book: async (parent, { _id }) => {
            return Book.findOne({ _id });  // changed Thought to Book
        },
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                //removed: .populate('friends')
                .populate('books'); // changed thoughts to books
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                //removed:  .populate('friends')
                .populate('books'); // changed thoughts to books
        }
    },
    //added:
    Mutation: {
        addUser: async (parent, args) => {
            console.log (args);
            console.log (parent);
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
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
                   
                const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: book._id } },  // ***THIS IS NOT CORRECT.  changed thoughts to books and thought._id to book._id
                { new: true, runValidators: true }
              );
              return updatedUser; // changed thought to updatedUser
            }

            //
            // const updatedUser = await User.findOneAndUpdate(
            //     { _id: user._id },
            //     { $addToSet: { savedBooks: body } },
            //     { new: true, runValidators: true }
            //   );
            //
          
            throw new AuthenticationError('You need to be logged in!');
          },
          // removed all reaction and friend code
    }
}